<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class SafeFile implements ValidationRule
{
    protected array $allowedMimes;

    protected array $dangerousChars = [
        "\0", "\u{202E}", "\u{202D}", "\u{202A}", "\u{202B}", "\u{202C}",
        "\u{2066}", "\u{2067}", "\u{2068}", "\u{2069}",
        "\u{0001}", "\u{0002}", "\u{0003}", "\u{0004}", "\u{0005}", "\u{0006}",
        "\u{0007}", "\u{0008}", "\u{0009}", "\u{000A}", "\u{000B}", "\u{000C}",
        "\u{000D}", "\u{000E}", "\u{000F}", "\u{0010}", "\u{0011}", "\u{0012}",
        "\u{0013}", "\u{0014}", "\u{0015}", "\u{0016}", "\u{0017}", "\u{0018}",
        "\u{0019}", "\u{001A}", "\u{001B}", "\u{001C}", "\u{001D}", "\u{001E}",
        "\u{001F}", "\u{007F}", "\u{200B}", "\u{200C}", "\u{200D}", "\u{2060}",
    ];

    protected array $mimeToExtensions = [
        'image/jpeg' => ['jpg', 'jpeg'],
        'image/png' => ['png'],
        'image/gif' => ['gif'],
        'image/bmp' => ['bmp'],
        'application/pdf' => ['pdf'],
    ];

    public function __construct(array $allowedMimes = [])
    {
        $this->allowedMimes = $allowedMimes;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value instanceof UploadedFile || !$value->isValid()) {
            $fail("File tidak valid.");
            return;
        }

        $filename = $value->getClientOriginalName();

        foreach ($this->dangerousChars as $char) {
            if (mb_strpos($filename, $char) !== false) {
                $fail("Nama file mengandung karakter berbahaya.");
                return;
            }
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $realMime = $finfo->file($value->getPathname());

        if (!empty($this->allowedMimes) && !in_array($realMime, $this->allowedMimes)) {
            $fail("Tipe file tidak diperbolehkan.");
            return;
        }

        $ext = strtolower($value->getClientOriginalExtension());
        $allowedExts = $this->mimeToExtensions[$realMime] ?? [];

        if (!in_array($ext, $allowedExts)) {
            $fail("Ekstensi file tidak sesuai dengan tipe file.");
            return;
        }
    }
}