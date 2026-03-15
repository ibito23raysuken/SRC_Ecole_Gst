<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Teacher::all();
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request) {
    $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => 'required|email|unique:teachers',
        'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($request->hasFile('photo')) {
        $photoPath = $request->file('photo')->store('teachers', 'public');
        $request->merge(['photo' => $photoPath]);
    }

    return Teacher::create($request->all());
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Teacher::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->update($request->all());
        if ($request->hasFile('photo')) {
    $photoPath = $request->file('photo')->store('teachers', 'public');
    $request->merge(['photo' => $photoPath]);
}

        return $teacher;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Teacher::findOrFail($id)->delete();
        return response()->noContent();
    }
}
