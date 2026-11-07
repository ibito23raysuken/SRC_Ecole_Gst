<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date', 'before:today'],
            'gender' => ['required', Rule::in(['male', 'female'])],
            'student_image' => ['nullable', 'image', 'max:1999'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'phone' => ['required', 'string', 'max:20'],
            'academic_year' => ['nullable', 'integer', 'min:2020', 'max:2030'],
            'grade_level' => ['nullable', Rule::in(['PS', 'MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e', '5e', '4e', '3e', '2nde', '1ère', 'Term'])],
            'school_class_id' => ['required', 'integer', 'exists:school_classes,id'],
            'registration_status' => ['required', Rule::in(['not_paid', 'half', 'full'])],
            'paid_months' => ['array'],
            'paid_months.*' => ['integer', 'min:1', 'max:12'],
            'parents' => ['sometimes', 'array'],
            'parents.*.id' => ['nullable', 'integer'],
            'parents.*.name' => ['required', 'string', 'max:255'],
            'parents.*.first_name' => ['nullable', 'string', 'max:255'],
            'parents.*.phone' => ['required', 'string', 'max:20'],
            'parents.*.email' => ['nullable', 'email'],
            'parents.*.profession' => ['nullable', 'string', 'max:255'],
            'parents.*.relationship' => ['required', Rule::in(['mother', 'father', 'guardian'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        foreach (['parents', 'payment', 'paid_months', 'dossier'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $this->merge([$field => json_decode($this->input($field), true)]);
            }
        }
    }
}
