from __future__ import annotations

import re
import subprocess
from datetime import datetime
from pathlib import Path
from shutil import copy2, which
from tempfile import TemporaryDirectory

from src.models import (
    EducationEntry,
    ExperienceEntry,
    ProjectEntry,
    ResumeDraft,
    ResumeSection,
    SkillGroup,
)


def escape_latex(value: str) -> str:
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
    return "".join(replacements.get(char, char) for char in value).replace("\n", " ")


def render_resume_latex(draft: ResumeDraft) -> str:
    contacts = r" \contactsep ".join(
        [
            rf"\contactlink{{mailto:{draft.email}}}{{{escape_latex(draft.email)}}}",
            rf"\contactlink{{{draft.website}}}{{{escape_latex(draft.website.replace('https://', ''))}}}",
            rf"\contactlink{{{draft.linkedin}}}{{{escape_latex(draft.linkedin.replace('https://', ''))}}}",
            rf"\contactlink{{{draft.github}}}{{{escape_latex(draft.github.replace('https://', ''))}}}",
        ]
    )

    lines = [
        r"\documentclass{resume_template}",
        "",
        rf"\resumename{{{escape_latex(draft.name)}}}",
        "\\resumecontacts{",
        f"  {contacts}",
        "}",
        rf"\resumesummary{{{escape_latex(draft.summary)}}}",
        "",
        r"\begin{document}",
        r"\makeheader",
        "",
    ]

    section_renderers = {
        ResumeSection.experience: _render_experience_section(draft.experiences)
        if draft.experiences
        else [],
        ResumeSection.projects: _render_project_section(draft.projects)
        if draft.projects
        else [],
        ResumeSection.education: _render_education_section(draft.education)
        if draft.education
        else [],
        ResumeSection.skills: _render_skill_section(draft.skill_groups)
        if draft.skill_groups
        else [],
    }

    for section in _resolved_section_order(draft):
        lines.extend(section_renderers.get(section, []))

    lines.append(r"\end{document}")
    return "\n".join(lines).strip() + "\n"


def compile_latex(latex_source: str, template_path: Path, output_pdf: Path) -> Path:
    if which("latexmk") is None:
        raise RuntimeError("latexmk is not installed or is not on PATH")

    output_pdf = output_pdf.resolve()
    output_pdf.parent.mkdir(parents=True, exist_ok=True)

    with TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        tex_file = temp_path / "resume.tex"
        tex_file.write_text(latex_source, encoding="utf-8")
        copy2(template_path, temp_path / "resume_template.cls")

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
        return output_pdf


def _render_experience_section(entries: list[ExperienceEntry]) -> list[str]:
    lines = [r"\section{Experience}", ""]
    for index, entry in enumerate(entries):
        lines.extend(
            [
                rf"\resumeentry{{{escape_latex(entry.company)}}}{{{_format_date_range(entry.dates)}}}{{{escape_latex(entry.role)}}}{{{_format_right_column(entry.location)}}}",
                r"\begin{resumebullets}",
            ]
        )
        for bullet in entry.bullets:
            lines.append(rf"  \item {escape_latex(bullet)}")
        lines.append(r"\end{resumebullets}")
        if index < len(entries) - 1:
            lines.extend([r"\entryspace", ""])
    lines.extend(["", ""])
    return lines


def _render_project_section(entries: list[ProjectEntry]) -> list[str]:
    lines = [r"\section{Projects}", ""]
    for index, entry in enumerate(entries):
        lines.extend(
            [
                rf"\resumeentry{{{escape_latex(entry.name)}}}{{{_format_date_range(entry.dates)}}}{{{escape_latex(entry.subtitle)}}}{{}}",
                r"\begin{tightresumebullets}",
            ]
        )
        for bullet in entry.bullets:
            lines.append(rf"  \item {escape_latex(bullet)}")
        lines.append(r"\end{tightresumebullets}")
        if index < len(entries) - 1:
            lines.extend([r"\entryspace", ""])
    lines.extend(["", ""])
    return lines


def _render_education_section(entries: list[EducationEntry]) -> list[str]:
    lines = [r"\section{Education}", ""]
    for index, entry in enumerate(entries):
        lines.append(
            rf"\resumeentry{{{escape_latex(entry.institution)}}}{{{_format_date_range(entry.dates)}}}{{{escape_latex(_clean_education_degree(entry.degree))}}}{{{_format_right_column(entry.location)}}}"
        )
        gpa, honors, coursework, extras = _education_metadata(entry)

        education_bullets: list[str] = []
        if gpa:
            education_bullets.append(f"GPA: {gpa}")
        if honors:
            education_bullets.append(f"Honors: {_natural_list(honors)}")
        if coursework:
            education_bullets.append(f"Relevant Coursework: {', '.join(coursework)}")
        education_bullets.extend(extras)

        if education_bullets:
            lines.append(r"\begin{tightresumebullets}")
            for bullet in education_bullets:
                lines.append(rf"  \item {escape_latex(bullet)}")
            lines.append(r"\end{tightresumebullets}")

        if index < len(entries) - 1:
            lines.extend([r"\entryspace", ""])
    lines.extend(["", ""])
    return lines


def _render_skill_section(entries: list[SkillGroup]) -> list[str]:
    lines = [r"\section{Skills}", ""]
    for entry in entries:
        joined = ", ".join(escape_latex(value) for value in entry.values)
        lines.append(rf"\resumelabelline{{{escape_latex(entry.label)}:}}{{{joined}}}")
    lines.extend(["", ""])
    return lines


def _resolved_section_order(draft: ResumeDraft) -> list[ResumeSection]:
    ordered: list[ResumeSection] = []
    for section in draft.section_order:
        if section not in ordered:
            ordered.append(section)

    for fallback in (
        ResumeSection.experience,
        ResumeSection.projects,
        ResumeSection.education,
        ResumeSection.skills,
    ):
        if fallback not in ordered:
            ordered.append(fallback)

    return [
        section
        for section in ordered
        if {
            ResumeSection.experience: bool(draft.experiences),
            ResumeSection.projects: bool(draft.projects),
            ResumeSection.education: bool(draft.education),
            ResumeSection.skills: bool(draft.skill_groups),
        }[section]
    ]


def _education_metadata(
    entry: EducationEntry,
) -> tuple[str, list[str], list[str], list[str]]:
    gpa = entry.gpa.strip()
    honors = [value.strip() for value in entry.honors if value.strip()]
    coursework = [value.strip() for value in entry.coursework if value.strip()]
    extras: list[str] = []

    for detail in entry.details:
        cleaned = detail.strip()
        if not cleaned:
            continue

        label, separator, value = cleaned.partition(":")
        normalized_label = label.strip().lower()
        normalized_value = value.strip() if separator else ""

        if separator and normalized_label == "gpa" and normalized_value and not gpa:
            gpa = normalized_value
            continue

        if separator and normalized_label in {"honors", "honours"} and normalized_value:
            honors.extend(_split_render_values(normalized_value))
            continue

        if (
            separator
            and normalized_label in {"relevant coursework", "coursework"}
            and normalized_value
        ):
            coursework.extend(_split_render_values(normalized_value))
            continue

        if "minor in spanish" in cleaned.lower():
            continue

        extras.append(cleaned)

    return (
        gpa,
        _dedupe_preserving_order(honors),
        _dedupe_preserving_order(coursework),
        extras,
    )


def _split_render_values(value: str) -> list[str]:
    parts = [
        piece.strip() for piece in re.split(r"\s*(?:\||;|,)\s*", value) if piece.strip()
    ]
    return parts or [value.strip()]


def _dedupe_preserving_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for value in values:
        key = value.lower()
        if key in seen:
            continue
        seen.add(key)
        ordered.append(value)
    return ordered


def _clean_education_degree(value: str) -> str:
    cleaned = value.strip()
    cleaned = re.sub(r",?\s*minor in spanish", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r",?\s*spanish minor", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s{2,}", " ", cleaned)
    return cleaned.strip(" ,;|-")


def _format_right_column(value: str) -> str:
    cleaned = escape_latex(value)
    if not cleaned:
        return ""
    return rf"\mbox{{{cleaned}}}"


def _format_date_range(value: str) -> str:
    raw = value.replace("\u2013", " - ").replace("\u2014", " - ").strip()
    if not raw:
        return ""

    suffix = ""
    suffix_match = re.search(r"\s*(\([^)]*\))\s*$", raw)
    if suffix_match:
        suffix = suffix_match.group(1)
        raw = raw[: suffix_match.start()].strip()

    cleaned = escape_latex(raw)
    if not cleaned:
        return ""

    cleaned = re.sub(r"\b([A-Za-z]+\.?)[ ]+(\d{4})\b", r"\1~\2", cleaned)
    cleaned = re.sub(r"\s*[-]\s*", r"--", cleaned)

    if suffix:
        return rf"{cleaned}~{escape_latex(suffix)}"

    return cleaned
