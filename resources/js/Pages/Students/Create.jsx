import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';

export default function Create() {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    gender: 'male',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    previousSchool: '',
    previousClass: '',
    academicYear: new Date().getFullYear().toString(),
    gradeLevel: 'CP',
    parents: [],
    dossier: {
      birthCertificate: false,
      medicalCertificate: false,
      reportCard: false,
      photo: false,
      idCard: false,
    },
    payment: {
      tuitionPayment: '',
      registrationMonths: [],
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showParents, setShowParents] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // État pour la notification
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDossierChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      dossier: {
        ...prev.dossier,
        [name]: checked
      }
    }));
  };

  const handleMultipleMonths = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentMonths = prev.payment.registrationMonths;
      return {
        ...prev,
        payment: {
          ...prev.payment,
          registrationMonths: checked
            ? [...currentMonths, value]
            : currentMonths.filter((m) => m !== value),
        },
      };
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        [name]: value
      }
    }));
  };

  const handleParentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedParents = [...formData.parents];
    updatedParents[index][name] = value;
    setFormData(prev => ({ ...prev, parents: updatedParents }));
  };

  const addParent = () => {
    if (formData.parents.length < 3) {
      setFormData(prev => ({
        ...prev,
        parents: [...prev.parents, {
          name: '',
          relationship: 'mother',
          phone: '',
          email: '',
          profession: '',
        }]
      }));
    }
  };

  const removeParent = (index) => {
    const updatedParents = formData.parents.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, parents: updatedParents }));
    if (updatedParents.length === 0) setShowParents(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation des champs obligatoires
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";

    // Validation de la date de naissance
    if (!formData.birthDate) {
      newErrors.birthDate = "La date de naissance est requise";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();

      if (birthDate > today) {
        newErrors.birthDate = "La date ne peut pas être dans le futur";
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age >= 18) {
          newErrors.birthDate = "L'élève doit être mineur";
        }
      }
    }


    // Validation du numéro de téléphone
    const phoneRegex = /^[0-9]{8,14}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone est invalide";
    }

    // Validation des parents
    if (showParents && formData.parents.length === 0) {
      newErrors.parents = "Au moins un parent doit être ajouté";
    }

    formData.parents.forEach((parent, index) => {
      if (!parent.name.trim()) {
        newErrors[`parents.${index}.name`] = "Le nom du parent est requis";
      }

      if (!parent.phone.trim()) {
        newErrors[`parents.${index}.phone`] = "Le téléphone du parent est requis";
      } else if (!phoneRegex.test(parent.phone)) {
        newErrors[`parents.${index}.phone`] = "Le numéro de téléphone est invalide";
      }
    });

    // Validation du paiement
    if (!formData.payment.tuitionPayment) {
      newErrors.tuitionPayment = "Veuillez sélectionner un statut de paiement";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(prev => ({ ...prev, ...data.errors }));
        } else {
          setErrors({ general: "Une erreur est survenue lors de l'enregistrement" });
        }
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      setErrors({ general: "Erreur réseau ou serveur" });
    } finally {
      setIsSubmitting(false);
    }
  };
    useEffect(() => {
    let timer;
    if (showSuccess) {
        timer = setTimeout(() => {
        setShowSuccess(false);
        }, 3000);
    }
    return () => clearTimeout(timer);
    }, [showSuccess]);
  return (
    <div className="max-w-4xl mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-red-700 mb-6">
        Inscription Scolaire - Année {formData.academicYear}
      </h2>
      {/* Notification de succès */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="font-medium">L'étudiant a été enregistré avec succès !</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom *"
              className={`w-full border p-2 rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom *"
              className={`w-full border p-2 rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Date de naissance *
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
          </div>

          <div>
             <label className="block mb-1 text-sm font-medium text-transparent">Placeholder</label>
            <input
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              placeholder="Lieu de naissance"
              className="w-full border p-2 rounded border-gray-300"
            />
          </div>

          <div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-300"
            >
              <option value="male">Masculin</option>
              <option value="female">Féminin</option>
            </select>
          </div>

          <div>
            <input
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Nationalité"
              className="w-full border p-2 rounded border-gray-300"
            />
          </div>
        </div>

        {/* Coordonnées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adresse *"
              className={`w-full border p-2 rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ville *"
              className={`w-full border p-2 rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          <div>
            <input
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Code postal *"
              className={`w-full border p-2 rounded ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>

            <div>
            <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm">
                +261
                </span>
                <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Numéro sans indicatif"
                className={`w-full border p-2 rounded-r ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
        </div>

        {/* Scolarité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              name="previousSchool"
              value={formData.previousSchool}
              onChange={handleChange}
              placeholder="Établissement précédent"
              className="w-full border p-2 rounded border-gray-300"
            />
          </div>

          <div>
            <input
              name="previousClass"
              value={formData.previousClass}
              onChange={handleChange}
              placeholder="Classe précédente"
              className="w-full border p-2 rounded border-gray-300"
            />
          </div>

          <div>
            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-300"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
                <option key={year} value={year}>{year}-{year + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-300"
            >
              {["PS", "MS", "GS", "CP", "CE1", "CE2", "CM1", "CM2", "6e", "5e", "4e", "3e", "2nde", "1ère", "Term"].map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <textarea
              name="specialNeeds"
              value={formData.specialNeeds}
              onChange={handleChange}
              placeholder="Besoins éducatifs particuliers"
              className="w-full border p-2 rounded border-gray-300"
              rows="3"
            ></textarea>
          </div>
        </div>

        {/* Ajouter parent bouton */}
        {!showParents && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                setShowParents(true);
                if (formData.parents.length === 0) addParent();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              + Ajouter un parent/tuteur
            </button>
          </div>
        )}

        {/* Parents */}
        {showParents && (
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Parents / Tuteurs</h3>

            {errors.parents && (
              <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
                {errors.parents}
              </div>
            )}

            {formData.parents.map((parent, index) => (
              <div key={index} className="border p-4 mb-4 rounded border-gray-300 bg-gray-50 relative">
                <h4 className="font-medium mb-3 text-gray-800">Parent {index + 1}</h4>

                <button
                  type="button"
                  onClick={() => removeParent(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                  title="Supprimer ce parent"
                >
                  &times;
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      name="name"
                      value={parent.name}
                      onChange={(e) => handleParentChange(index, e)}
                      placeholder="Nom complet *"
                      className={`w-full border p-2 rounded ${errors[`parents.${index}.name`] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors[`parents.${index}.name`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`parents.${index}.name`]}</p>
                    )}
                  </div>

                  <div>
                    <select
                      name="relationship"
                      value={parent.relationship}
                      onChange={(e) => handleParentChange(index, e)}
                      className="w-full border p-2 rounded border-gray-300"
                    >
                      <option value="mother">Mère</option>
                      <option value="father">Père</option>
                      <option value="guardian">Tuteur</option>
                    </select>
                  </div>

                  <div>
                    <input
                      name="phone"
                      value={parent.phone}
                      onChange={(e) => handleParentChange(index, e)}
                      placeholder="Téléphone *"
                      className={`w-full border p-2 rounded ${errors[`parents.${index}.phone`] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors[`parents.${index}.phone`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`parents.${index}.phone`]}</p>
                    )}
                  </div>

                  <div>
                    <input
                      name="email"
                      value={parent.email}
                      onChange={(e) => handleParentChange(index, e)}
                      placeholder="Email"
                      className="w-full border p-2 rounded border-gray-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <input
                      name="profession"
                      value={parent.profession}
                      onChange={(e) => handleParentChange(index, e)}
                      placeholder="Profession"
                      className="w-full border p-2 rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="text-right mb-6">
              <button
                type="button"
                onClick={addParent}
                disabled={formData.parents.length >= 3}
                className={`px-4 py-2 rounded transition ${
                  formData.parents.length >= 3
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                + Ajouter un autre parent
              </button>
            </div>
          </div>
        )}

        {/* Dossier de l'élève */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-red-700 mb-4">Dossier à fournir</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'birthCertificate', label: 'Acte de naissance' },
              { name: 'medicalCertificate', label: 'Certificat médical' },
              { name: 'reportCard', label: 'Bulletin scolaire' },
              { name: 'photo', label: "Photo d'identité" },
              { name: 'idCard', label: 'Carte d\'identité' },
            ].map(({ name, label }) => (
              <label key={name} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={name}
                  checked={formData.dossier[name]}
                  onChange={handleDossierChange}
                  className="form-checkbox text-red-600"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Paiement */}
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-red-700 mb-4">Paiement</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Droit d'inscription *
              </label>
              <select
                name="tuitionPayment"
                value={formData.payment.tuitionPayment}
                onChange={handlePaymentChange}
                className={`w-full border p-2 rounded ${errors.tuitionPayment ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">-- Sélectionner --</option>
                <option value="half">Moitié payé</option>
                <option value="full">Totalité payé</option>
                <option value="notPaid">Non payé</option>
              </select>
              {errors.tuitionPayment && (
                <p className="mt-1 text-sm text-red-600">{errors.tuitionPayment}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Mois de paiement des frais d'inscription
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "janvier", "février", "mars", "avril",
                  "mai", "juin", "juillet", "août",
                  "septembre", "octobre", "novembre", "décembre"
                ].map((month) => (
                  <label key={month} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={month}
                      checked={formData.payment.registrationMonths.includes(month)}
                      onChange={handleMultipleMonths}
                      className="mr-2"
                    />
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center border-t pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md text-white font-medium ${
              isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            } transition`}
          >
            {isSubmitting ? 'Enregistrement en cours...' : "Finaliser l'inscription"}
          </button>
        </div>
      </form>
    </div>
  );
}
