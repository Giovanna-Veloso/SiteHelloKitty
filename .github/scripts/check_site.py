"""Check local HTML references in the files packaged for GitHub Pages."""

import posixpath
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class References(HTMLParser):
    attributes = {"a": "href", "link": "href", "img": "src", "script": "src"}

    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attribute = self.attributes.get(tag)
        value = dict(attrs).get(attribute) if attribute else None
        if value:
            self.links.append((self.getpos()[0], value))


def main(root):
    files = {path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file()}
    if "index.html" not in files:
        sys.exit("index.html ausente na raiz do artefato.")

    pages = sorted(path for path in files if path.endswith(".html"))
    errors = []
    checked = 0
    for page in pages:
        parser = References()
        parser.feed((root / page).read_text(encoding="utf-8"))
        parser.close()
        for line, value in parser.links:
            url = urlsplit(value)
            if url.scheme or url.netloc or not url.path:
                continue
            checked += 1
            path = unquote(url.path)
            target = posixpath.normpath(posixpath.join(posixpath.dirname(page), path))
            if path.startswith("/") or target not in files:
                errors.append(f"{page}:{line}: referência local inválida: {value}")

    if errors:
        sys.exit("\n".join(errors))
    print(f"OK: {len(pages)} páginas HTML e {checked} referências locais validadas.")

    scripts = sorted(path for path in files if path.endswith(".js"))
    for script in scripts:
        subprocess.run(["node", "--check", str(root / script)], check=True)
    print(f"OK: sintaxe de {len(scripts)} arquivos JavaScript validada.")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
