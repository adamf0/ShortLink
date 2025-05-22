<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $data->slug }}</title>

    <!-- Open Graph meta tags -->
    <meta property="og:title" content="{{ $data->metaTitle }}">
    <meta property="og:description" content="{{ $data->metaDesc }}">
    <meta property="og:url" content="{{ $data->url }}">
    @if(!empty($data->file))
    <meta property="og:image" content="{{ $data->file }}">
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="400" />
    @endif
    <!-- Optional: Redirect after a few seconds -->
    <meta http-equiv="refresh" content="1;url={{ $data->url }}">

</head>
<body>
    <p>Redirecting to <a href="{{ $data->url }}">{{ $data->url }}</a>...</p>
</body>
</html>
