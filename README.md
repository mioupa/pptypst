<div align="center">
  <a href="https://mampf.mathi.uni-heidelberg.de/">
    <img src="https://github.com/user-attachments/assets/07745d89-fde6-4347-84ba-9a78c164d870"
      width="130px" alt="PPTypst Logo"/>
  </a>

  <div align="center">
    <h3 align="center">PPTypst</h3>
    <p>
      <strong>Bring <a href="https://typst.app">Typst</a> to PowerPoint</strong> | <a href="https://youtu.be/c6sfzu2--iY">YouTube Tutorial</a>
      | <a href="https://youtube.com/shorts/O-FMtAGROdA">YouTube Short</a><br>
      <sub><i>This community project is not affiliated with or endorsed by Typst.</i></sub>
    </p>
  </div>
</div>

> [!Important]
> Unfortunately, I cannot publish this Add-in to the PowerPoint Add-in Marketplace due to regulations by Microsoft. See [my comment](https://github.com/Splines/pptypst/issues/4#issuecomment-3909389633). You can still use PPTypst by [manual installation](./INSTALL.md), but unfortunately it's not as easy as one single click.

Easily insert Typst equations with live preview, update them, and even generate from a file.

https://github.com/user-attachments/assets/23e91847-61f8-40a4-a6f2-0bc20b6df504

![pptypst-preview](https://github.com/user-attachments/assets/be273628-94fe-4117-b0dd-4d0e87f47d52)

<https://github.com/user-attachments/assets/3cb307af-4c02-4665-8f2c-34c23c6f68fc>

### Installation

See [the Install guide](./INSTALL.md).

### Tutorial

[YouTube: Animate equations in PowerPoint with PPTypst](https://youtu.be/c6sfzu2--iY)

<a href="https://youtu.be/c6sfzu2--iY">
  <img src="https://github.com/user-attachments/assets/cd883ee6-099d-4cfa-bf15-854eecdcb448" width="400px"/>
</a>

### How it works & Developing

See the [Dev Guide](DEV.md).

### 🎈 About

The first proof-of-concept came from Johannes Berger [here](https://github.com/johannesber/typst-ppt-addin) in January 2026. I forked the repo and have since been building on it, replacing the custom engine by the awesome [`typst.ts`](https://github.com/Myriad-Dreamin/typst.ts) by Myriad-Dreamin, migrating to TypeScript, improving on code quality, as well as polishing and adding a lot more functionality. If you have any feature requests or want to report a bug, head over to the [issues](https://github.com/Splines/pptypst/issues).

### Fonts

This fork bundles the following fonts (in [`web/public/`](./web/public/)), loaded into the Typst compiler in [`web/src/typst.ts`](./web/src/typst.ts):

| Font | File | Role | Source | License |
| --- | --- | --- | --- | --- |
| New Computer Modern Sans Math | `NewCMSansMath-Regular.otf` | Math (OpenType MATH table) and Latin body text | [CTAN `newcomputermodern`](https://ctan.org/pkg/newcomputermodern) | GUST Font License / GFL — [`NewCM-License.txt`](./web/public/NewCM-License.txt) |
| Noto Sans JP | `NotoSansJP-Regular.ttf`, `NotoSansJP-Bold.ttf` | Japanese / CJK body text fallback | [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+JP) | SIL OFL 1.1 — [`NotoSansJP-OFL.txt`](./web/public/NotoSansJP-OFL.txt) |

The default body font is `Noto Sans JP` (covers both Latin and Japanese) and math equations use `New Computer Modern Sans Math`, so equations and Japanese text render without per-document `#set text(font: ...)`. Override the body font per document via the preamble, e.g. `#set text(font: "New Computer Modern Sans Math")`. Family names are the names Typst reports (`typst fonts --font-path web/public`), not the file names.

### License

This project is licensed under the very permissive MIT-license. See the [License file](./LICENSE). However, notice that the branding (including the logo and the name of this project) are exempt from the license. Bundled fonts are distributed under their own licenses (see the Fonts section above).
