# QR code

`encode.ts` turns text into a QR Code matrix (byte mode, versions 1–10, error
correction L or M, standard mask choice). `index.tsx` draws it as an SVG with a
white tile and four-module quiet zone in both themes. It exists so the account
page can show the phone sign-in QR without a new runtime dependency.

The algorithm follows Project Nayuki's QR Code generator (MIT License,
Copyright © Project Nayuki, https://www.nayuki.io/page/qr-code-generator-library).
Tests compare matrices with references produced by the MIT `qrcode` 1.5.4
package (frozen in `tests/reference.ts`).

Project Nayuki's notice, retained for the parts whose structure this follows:

> Copyright (c) Project Nayuki. (MIT License)
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
> the Software, and to permit persons to whom the Software is furnished to do so,
> subject to the following conditions:
> - The above copyright notice and this permission notice shall be included in
>   all copies or substantial portions of the Software.
> - The Software is provided "as is", without warranty of any kind, express or
>   implied, including but not limited to the warranties of merchantability,
>   fitness for a particular purpose and noninfringement. In no event shall the
>   authors or copyright holders be liable for any claim, damages or other
>   liability, whether in an action of contract, tort or otherwise, arising from,
>   out of or in connection with the Software or the use or other dealings in the
>   Software.
