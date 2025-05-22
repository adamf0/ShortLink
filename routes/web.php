<?php

use App\Http\Controllers\DashboardController;
use App\Http\Middleware\ClearCookies;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class,'Index']);
Route::post('/create-link', [DashboardController::class,'Create']);
Route::get('/redirect/{slug}', [DashboardController::class,'Redirect'])->middleware(ClearCookies::class);