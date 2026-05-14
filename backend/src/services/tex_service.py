from pathlib import Path
from typing import List, Tuple, Optional
from shutil import copy2
from tempfile import TemporaryDirectory
import subprocess
from uuid import uuid4

from src.models import SkillSection

BASE_DIR = Path(__file__).resolve().parents[3]

class TexService():
    def __init__(self, session_id: str):
        self.session_path = BASE_DIR / "backend" / "sessions" / session_id
        self.session_id = session_id
        self.resume_string = r""
        self.sections = set()
        self.template_path = BASE_DIR / "data" / "resume_template.cls"

    def resume_start(self, name: str, contacts: List[Tuple[str, str]], summary: Optional[str] = None):
        self.resume_string += r"\documentclass{resume_template}\n\n"
        self.resume_string += f"\\resumename{{{name}}}\n\n"
        self.resume_string += r"\resumecontacts{\n"

        for label, value in contacts:
            self.resume_string += f"  \\contactlink{{{label}}}{{{value}}}\\contactsep\n"
        self.resume_string += r"}\n\n"

        self.resume_string += f"\\resumesummary{{{summary}}}\n\n"
        self.resume_string += r"\begin{document}\n"
        self.resume_string += r"\makeheader\n\n"

        self.sections.add("start")
        return f"Started resume with {len(contacts)} contacts for {name} with a {len(summary) if summary else 0} character summary."

    def resume_add_experience(self, title: str, dates: Tuple[str, str], role: str, location: str, bullets: List[str]):
        if not "start" in self.sections:
            return "Must start the resume before making an Experience section"

        if not "experience" in self.sections:
            self.resume_string += r"\section{Experience}\n"

        date_start = dates[0]
        date_end = dates[1]
        self.resume_string += f"\\resumeentry{{{title}}}{{{date_start} -- {date_end}}}{{{role}}}{{{location}}}\n"
        self.resume_string += r"\begin{resumebullets}\n"

        for bullet in bullets:
            self.resume_string += f"  \\item {{{bullet}}}\n"
        self.resume_string += r"\end{resumebullets}\n"
        self.resume_string += r"\entryspace"

        self.sections.add("experience")
        return f"Started resume with {len(bullets)} bullets for {role} at {title}."

    def resume_add_education(self, school: str, dates: Tuple[str, str], degree: str, location: str):
        if not "start" in self.sections:
            return "Must start the resume before making an Education section"

        if not "education" in self.sections:
            self.resume_string += r"\section{Education}\n"

        date_start = dates[0]
        date_end = dates[1]
        self.resume_string += f"\\resumeentry{{{school}}}{{{date_start} -- {date_end}}}{{{degree}}}{{{location}}}\n"
        self.resume_string += r"\entryspace"

        self.sections.add("education")

        return f"Added Education section for {degree} at {school}."

    def resume_add_skills(self, sections: List[SkillSection]):
        if not "start" in self.sections:
            return "Must start the resume before making a Skills section"

        if not "skills" in self.sections:
            self.resume_string += r"\section{Skills}\n"

        for section in sections:
            self.resume_string += f"\\resumelabelline{{{section.section_name}:}}"
            self.resume_string += r"{"
            for i, element in enumerate(section.section_elements):
                if i == len(section.section_elements) - 1
                    self.resume_string += f"{element}"
                else:
                    self.resume_string += f"{element},"
                self.resume_string += r"}\n"

        self.resume_string += "\n\n"

        self.sections.add("skills")

        return f"Added Skills section with {len(sections)} sections."

    def resume_end(self):
        self.resume_string += r"\end{document}"
        result = self._compile_tex()
        return result

    def _compile_tex(self):
        output_pdf = self.session_path / "resumes" / str(uuid4())
        output_pdf = output_pdf.resolve()
        output_pdf.parent.mkdir(parents=True, exist_ok=True)
        with TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            tex_file = temp_path / "resume.tex"
            tex_file.write_text(self.resume_string, encoding="utf-8")
            copy2(self.template_path, temp_path / "resume_template.cls")

            command = [
                "latexmk",
                "-pdf",
                "-interaction=nonstopmode",
                f"-output-directory={temp_path}",
                tex_file.name,
            ]

            result = subprocess.run(
                command,
                cwd=temp_path,
                check=False,
                capture_output=True,
                text=True,
            )

            built_pdf = temp_path / "resume.pdf"
            if result.returncode != 0 or not built_pdf.exists():
                raise RuntimeError(result.stderr or result.stdout or "latexmk failed")

            copy2(built_pdf, output_pdf)
            self.output_path = output_pdf
            return f"Resume compiled and output pdf located at: {output_pdf}"

