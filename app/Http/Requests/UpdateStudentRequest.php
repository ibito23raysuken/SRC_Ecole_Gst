<?php

namespace App\Http\Requests;

use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $student = $this->route('student');

        return $student instanceof Student
            && $this->user()?->can('modify', $student) === true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'birth_date' => ['sometimes', 'date', 'before:today'],
            'gender' => ['sometimes', Rule::in(['male', 'female'])],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'school_class_id' => ['sometimes', 'integer', 'exists:school_classes,id'],
            'academic_year' => ['nullable', 'integer', 'min:2020', 'max:2030'],
            'grade_level' => ['nullable', Rule::in(['PS', 'MS', 'GS', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e', '5e', '4e', '3e', '2nde', '1ère', 'Term'])],
            'payment' => ['sometimes', 'array'],
            'payment.tuitionPayment' => ['sometimes', 'required_with:payment', Rule::in(['half', 'full', 'not_paid'])],
            'payment.registrationMonths' => ['sometimes', 'array'],
            'payment.registrationMonths.*' => ['string'],
            'parents' => ['sometimes', 'array'],
            'parents.*.id' => ['nullable', 'integer'],
            'parents.*.name' => ['required', 'string', 'max:255'],
            'parents.*.first_name' => ['nullable', 'string', 'max:255'],
            'parents.*.phone' => ['required', 'string', 'max:20'],
            'parents.*.email' => ['nullable', 'email'],
            'parents.*.profession' => ['nullable', 'string', 'max:255'],
            'parents.*.relationship' => ['required', Rule::in(['mother', 'father', 'guardian'])],
            'dossier' => ['sometimes', 'array'],
            'dossier.birthCertificate' => ['sometimes', 'required_with:dossier', 'boolean'],
            'dossier.medicalCertificate' => ['sometimes', 'required_with:dossier', 'boolean'],
            'dossier.residenceCertificate' => ['sometimes', 'required_with:dossier', 'boolean'],
            'dossier.reportCard' => ['sometimes', 'required_with:dossier', 'boolean'],
            'dossier.idCard' => ['sometimes', 'required_with:dossier', 'boolean'],
            'student_image' => ['nullable', 'image', 'max:1999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        foreach (['parents', 'payment', 'dossier'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $this->merge([$field => json_decode($this->input($field), true)]);
            }
        }
    }
}
