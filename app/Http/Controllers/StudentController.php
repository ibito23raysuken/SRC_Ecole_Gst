<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Student::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields=$request->validate([
            'lastName'=>'required|max:255',
            'firstName'=>'required'
        ]);
        $student=Student::Create($fields);
        return $student;
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return $student;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        $fields=$request->validate([
            'lastName'=>'required|max:255',
            'firstName'=>'required'
        ]);
        $student->update($fields);
        return $student;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();
        return ['message'=>"La suppression de l'étudiant a été effectuée."];
    }
}
