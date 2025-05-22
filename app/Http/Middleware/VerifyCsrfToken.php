<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Session\TokenMismatchException;

class VerifyCsrfToken
{
    /**
     * Indicates whether the CSRF token should be added to the response cookies.
     *
     * @var bool
     */
    protected $addHttpCookie = false;

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        "/redirect",
        "/create-link"
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        return $next($request);
    }

    /**
     * Add the CSRF token to the response cookies if enabled.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Response  $response
     * @return \Illuminate\Http\Response
     */
    protected function addCookieToResponse(Request $request, $response)
    {
        // if ($this->addHttpCookie) {
        //     $response->headers->setCookie(cookie()->forever('XSRF-TOKEN', $request->session()->token()));
        // }

        return $response;
    }
}
