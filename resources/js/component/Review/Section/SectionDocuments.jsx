import Section from "../Section/section";

export default function SectionDocuments({ student }) {

    const documents = [
        { key: "birth_certificate", label: "Acte de naissance" },
        { key: "medical_certificate", label: "Certificat médical" },
        { key: "report_card", label: "Relevé de notes" },
        { key: "id_card", label: "Carte d'identité" },
    ];

    return (
        <Section title="Documents">
            <div className="space-y-3">

                {documents.map((doc) => {
                    const status = student[doc.key];

                    return (
                        <div key={doc.key} className="flex justify-between items-center">

                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-4 h-4 rounded-full ${
                                        status ? "bg-green-500" : "bg-red-500"
                                    }`}
                                ></div>

                                <span className="font-medium">
                                    {doc.label}
                                </span>
                            </div>

                            <span
                                className={`text-sm font-semibold ${
                                    status ? "text-green-600" : "text-red-600"
                                }`}
                            >
                                {status ? "Fourni" : "Non fourni"}
                            </span>

                        </div>
                    );
                })}

            </div>
        </Section>
    );
}
