<?php
use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app'); // Vue qui charge React
})->where('any', '.*');
