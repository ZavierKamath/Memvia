latexmk -pdf resume.tex -outdir=build resume.tex

---

import subprocess
try:
    result = subprocess.run(
        ["latexmk", "-pdf", "resume.tex"],
        check=True,
        capture_output=True,
        text=True,
    )
    print(result.stdout)
except subprocess.CalledProcessError as e:
    print("Compile failed")
    print(e.stdout)
    print(e.stderr)
If the .tex file is in another directory, use cwd:
result = subprocess.run(
    ["latexmk", "-pdf", "resume.tex"],
    cwd=r"C:\path\to\resume\folder",
    check=True,
    capture_output=True,
    text=True,
)

---

\documentclass{resume_template}
\resumename{Jane Doe}
\resumecontacts{
  \contactlink{mailto:jane@example.com}{jane@example.com}
  \contactsep
  \contactlink{https://janedoe.dev}{janedoe.dev}
  \contactsep
  \contactlink{https://www.linkedin.com/in/janedoe}{linkedin.com/in/janedoe}
  \contactsep
  \contactlink{https://github.com/janedoe}{github.com/janedoe}
}
\resumesummary{Software engineer with experience building web applications and internal tools.}
\begin{document}
\makeheader
\section{Experience}
\resumeentry{Example Company}{2023 -- Present}{Software Engineer}{Remote}
\begin{resumebullets}
  \item Built internal tooling for faster support workflows.
  \item Improved reliability and developer productivity across the team.
\end{resumebullets}
\entryspace
\section{Education}
\resumeentry{State University}{2020 -- 2024}{B.S. in Computer Science}{City, ST}
\entryspace
\section{Skills}
\resumelabelline{Languages:}{Python, TypeScript, SQL}
\resumelabelline{Tools:}{Git, Docker, Linux}
\end{document}

---

Use shutil.
For one file:
from shutil import copy2
copy2("source/path/file.txt", "dest/path/file.txt")
If the second path is a directory, it keeps the same filename:
from shutil import copy2
copy2("source/path/file.txt", "dest/path/")
If you want to create the destination folder first:
from pathlib import Path
from shutil import copy2
src = Path("source/path/file.txt")
dst = Path("dest/path/file.txt")
dst.parent.mkdir(parents=True, exist_ok=True)
copy2(src, dst)
For an entire directory:
from shutil import copytree
copytree("source_dir", "dest_dir")
If the destination directory may already exist:
from shutil import copytree
copytree("source_dir", "dest_dir", dirs_exist_ok=True)
Useful rule of thumb:
- copy2() for a single file
- copytree() for a whole folder
In your LaTeX case, copying the .cls file is typically:
from shutil import copy2
copy2("resume_template.cls", "build/resume_template.cls")
