<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Fortify;

class LogoutResponse implements LogoutResponseContract
{
    public function toResponse($request)
    {
        return $request->expectsJson()
            ? response()->json('', 204)
            : redirect(Fortify::redirects('logout', '/'));
    }
}
