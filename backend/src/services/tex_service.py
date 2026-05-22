from pathlib import Path
from typing import List, Tuple, Optional
from shutil import copy2
from tempfile import TemporaryDirectory
import subprocess
from uuid import uuid4

from src.models import SkillSection, Contact, Dates

BASE_DIR = Path(__file__).resolve().parents[3]

class TexService():
    def __init__(self, session_id: str):
        self.session_path = BASE_DIR / "backend" / "sessions" / session_id
        self.session_id = session_id
        self.resume_string = r""
        self.sections = set()
        self.template_path = BASE_DIR / "data" / "resume_template.cls"

    def resume_start(self, name: str, contacts: List[Contact], summary: str):
        self.resume_string += "\\documentclass{resume_template}\n"
        self.resume_string += f"\\resumename{{{self._escape_tex(name)}}}\n\n"
        self.resume_string += "\\resumecontacts{\n"

        for contact in contacts:
            self.resume_string += f"  \\contactlink{{{self._escape_tex(contact.value)}}}{{{self._escape_tex(contact.label)}}}\n"
        self.resume_string += "}\n"

        self.resume_string += f"\\resumesummary{{{self._escape_tex(summary)}}}\n\n"
        self.resume_string += "\\begin{document}\n"
        self.resume_string += "\\makeheader\n"

        self.sections.add("start")
        return f"Started resume with {len(contacts)} contacts for {name} with a {len(summary) if summary else 0} character summary."

    def resume_add_experience(self, title: str, dates: Dates, role: str, location: str, bullets: List[str]):
        if not "start" in self.sections:
            return "Must start the resume before making an Experience section"

        if not "experience" in self.sections:
            self.resume_string += "\\section{Experience}\n"

        date_start = dates.start_date
        date_end = dates.end_date

        title, date_start, date_end, role, location = self._escape_tex(title), self._escape_tex(date_start), self._escape_tex(date_end), self._escape_tex(role), self._escape_tex(location) 

        self.resume_string += f"\\resumeentry{{{title}}}{{{date_start} -- {date_end}}}{{{role}}}{{{location}}}\n"
        self.resume_string += "\\begin{resumebullets}\n"

        for bullet in bullets:
            self.resume_string += f"  \\item {{{self._escape_tex(bullet)}}}\n"
        self.resume_string += "\\end{resumebullets}\n"
        self.resume_string += "\\entryspace\n"

        self.sections.add("experience")
        return f"Started resume with {len(bullets)} bullets for {role} at {title}."

    def resume_add_education(self, school: str, dates: Dates, degree: str, location: str, bullets: List[str]):
        if not "start" in self.sections:
            return "Must start the resume before making an Education section"

        if not "education" in self.sections:
            self.resume_string += "\\section{Education}\n"

        date_start = dates.start_date
        date_end = dates.start_date

        school, date_start, date_end, degree, location = self._escape_tex(school), self._escape_tex(date_start), self._escape_tex(date_end), self._escape_tex(degree), self._escape_tex(location) 

        self.resume_string += f"\\resumeentry{{{school}}}{{{date_start} -- {date_end}}}{{{degree}}}{{{location}}}\n"
        self.resume_string += "\\entryspace\n"
        self.resume_string += "\\begin{resumebullets}\n"

        for bullet in bullets:
            self.resume_string += f"  \\item {{{self._escape_tex(bullet)}}}\n"
        self.resume_string += "\\end{resumebullets}\n"
        self.resume_string += "\\entryspace\n"

        self.sections.add("education")

        return f"Added Education section for {degree} at {school}."

    def resume_add_skills(self, sections: List[SkillSection]):
        if not "start" in self.sections:
            return "Must start the resume before making a Skills section"

        if not "skills" in self.sections:
            self.resume_string += "\\section{Skills}\n"

        for section in sections:
            self.resume_string += f"\\resumelabelline{{{self._escape_tex(section.section_name)}:}}"
            self.resume_string += "{\n"
            for i, element in enumerate(section.section_elements):
                if i == len(section.section_elements) - 1:
                    self.resume_string += f"{self._escape_tex(element)}"
                else:
                    self.resume_string += f"{self._escape_tex(element)}, "
            self.resume_string += "}\n\n"

        self.sections.add("skills")

        return f"Added Skills section with {len(sections)} sections."

    def resume_end(self):
        self.resume_string += "\\end{document}\n"
        result = self._compile_tex()
        return result

    def _escape_tex(self, value: str):
        replacements = {
            "\\": r"\textbackslash{}",
            "&": r"\&",
            "%": r"\%",
            "$": r"\$",
            "#": r"\#",
            "_": r"\_",
            "{": r"\{",
            "}": r"\}",
            "~": r"\textasciitilde{}",
            "^": r"\textasciicircum{}",
        }
        return "".join(replacements.get(char, char) for char in value)

    def _compile_tex(self):
        pdf_name = "reusme_" + str(uuid4()) + ".pdf"
        output_pdf = self.session_path / "resumes" / pdf_name
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
                raise RuntimeError(result.stdout or "latexmk failed")

            copy2(built_pdf, output_pdf)
            self.output_path = output_pdf
            return f"Resume compiled and output pdf located at: {output_pdf}"

