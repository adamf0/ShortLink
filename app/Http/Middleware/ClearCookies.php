<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Cookie;

class ClearCookies
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Menghapus cookie XSRF-TOKEN dan laravel_session
        $response->headers->setCookie(
            Cookie::create('XSRF-TOKEN')->withValue('')->withExpires(0)
        );
        $response->headers->setCookie(
            Cookie::create('laravel_session')->withValue('')->withExpires(0)
        );

        return $response;
    }
}
