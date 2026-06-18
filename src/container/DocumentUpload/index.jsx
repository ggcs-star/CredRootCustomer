import React, {
    useEffect,
    useState,
} from "react";

import {
    getLeadDocuments,
    uploadDocument,
    finalizeApplication,
} from "../../../api";

const DocumentUpload = () => {
    const [loading, setLoading] =
        useState(true);

    const [uploadingId, setUploadingId] =
        useState(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [documents, setDocuments] =
        useState([]);


    const [selectedFiles, setSelectedFiles] =
        useState({});

    const [uploadedDocs, setUploadedDocs] =
        useState({});

    const getLeadId = () => {
        let id = localStorage.getItem("lead_id");

        if (!id) {
            const onboardingData = JSON.parse(
                localStorage.getItem("onboarding_data") || "{}"
            );

            id = onboardingData?.active_lead?.id;

            if (id) {
                localStorage.setItem("lead_id", id);
            }
        }

        return id;
    };

    const leadId = getLeadId();

    useEffect(() => {
        fetchDocuments();
    }, []);



    const fetchDocuments = async () => {
        try {
            const currentLeadId = getLeadId();

            if (!currentLeadId) {
                alert("Lead ID not found");
                return;
            }

            console.log("Lead ID:", currentLeadId);

            const response = await getLeadDocuments(
                currentLeadId
            );

            console.log(
                "Documents Response:",
                response?.data
            );

            setDocuments(
                response?.data?.data?.documents || []
            );
        } catch (error) {
            console.error(
                "Document Fetch Error:",
                error
            );

            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const allMandatoryUploaded =
        documents
            .filter(
                (doc) => doc.is_mandatory
            )
            .every(
                (doc) =>
                    doc.uploaded_files &&
                    doc.uploaded_files.length > 0
            );

    const handleFileChange = (
        documentId,
        file
    ) => {
        setSelectedFiles((prev) => ({
            ...prev,
            [documentId]: file,
        }));
    };

    const handleUpload = async (
        documentId
    ) => {
        try {
            const file =
                selectedFiles[documentId];

            if (!file) {
                alert(
                    "Please select a file first"
                );
                return;
            }

            if (!leadId) {
                alert(
                    "Lead ID not found. Please login again."
                );
                return;
            }

            setUploadingId(documentId);

            const formData =
                new FormData();

            formData.append(
                "lead_id",
                leadId
            );

            formData.append(
                "document_master_id",
                documentId
            );

            formData.append(
                "document_side",
                "front"
            );

            formData.append(
                "file",
                file
            );

            const response =
                await uploadDocument(
                    formData
                );

            console.log(
                "Upload Response:",
                response.data
            );

            setUploadedDocs((prev) => ({
                ...prev,
                [documentId]: {
                    uploaded: true,
                    status:
                        response?.data?.data?.verification_status ||
                        response?.data?.data?.status ||
                        "pending"
                },
            }));

            setDocuments((prev) =>
                prev.map((doc) =>
                    doc.id === documentId
                        ? {
                            ...doc,
                            uploaded_files: [
                                {
                                    id: Date.now(),
                                    side: "front",
                                    status:
                                        response?.data
                                            ?.data
                                            ?.verification_status ||
                                        "pending",
                                },
                            ],
                        }
                        : doc
                )
            );

            alert(
                response?.data?.message ||
                "Document Uploaded Successfully"
            );

            fetchDocuments();
        } catch (error) {
            console.error(
                "Upload Error:",
                error
            );

            alert(
                error?.response?.data
                    ?.message ||
                "Upload Failed"
            );
        } finally {
            setUploadingId(null);
        }
    };

    const handleFinalizeApplication =
        async () => {
            try {
                if (!leadId) {
                    alert(
                        "Lead ID not found"
                    );
                    return;
                }

                setSubmitting(true);

                const response =
                    await finalizeApplication(
                        leadId
                    );

                alert(
                    response?.data?.message ||
                    "Application Submitted Successfully"
                );

                fetchDocuments();
            } catch (error) {
                console.error(error);

                alert(
                    error?.response?.data
                        ?.message ||
                    "Failed To Submit Application"
                );
            } finally {
                setSubmitting(false);
            }
        };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-lg font-semibold">
                    Loading Documents...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black">
                        Upload Documents
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Upload all required
                        documents to proceed.
                    </p>
                </div>

                <div className="space-y-6">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="border border-gray-200 rounded-2xl p-6"
                        >
                            <div className="flex flex-col lg:flex-row justify-between gap-5">

                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-black">
                                        {doc.name}
                                    </h3>

                                    <p className="text-gray-500 mt-2">
                                        {doc.description}
                                    </p>

                                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                                        <p>
                                            <strong>
                                                Document Code:
                                            </strong>{" "}
                                            {doc.document_code}
                                        </p>

                                        <p>
                                            <strong>
                                                Allowed Formats:
                                            </strong>{" "}
                                            {
                                                doc.allowed_formats
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Max Size:
                                            </strong>{" "}
                                            {doc.max_size_kb}
                                            KB
                                        </p>

                                        <p>
                                            <strong>
                                                Sides Required:
                                            </strong>{" "}
                                            {
                                                doc.sides_required
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    {doc.is_mandatory ? (
                                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                                            Mandatory
                                        </span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Optional
                                        </span>
                                    )}

                                    <div className="mt-3">
                                        {uploadedDocs[
                                            doc.id
                                        ]?.uploaded ||
                                            doc
                                                .uploaded_files
                                                ?.length >
                                            0 ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                Uploaded
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col md:flex-row gap-4">
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        handleFileChange(
                                            doc.id,
                                            e.target
                                                .files[0]
                                        )
                                    }
                                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 bg-white text-black"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleUpload(
                                            doc.id
                                        )
                                    }
                                    disabled={
                                        uploadingId ===
                                        doc.id
                                    }
                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {uploadingId ===
                                        doc.id
                                        ? "Uploading..."
                                        : "Upload"}
                                </button>
                            </div>

                            {(uploadedDocs[
                                doc.id
                            ]?.uploaded ||
                                doc
                                    .uploaded_files
                                    ?.length >
                                0) && (
                                    <div className="mt-5">
                                        <h4 className="font-semibold text-green-600 mb-3">
                                            Uploaded Files
                                        </h4>

                                        {uploadedDocs[
                                            doc.id
                                        ]?.uploaded ? (
                                            <div className="flex justify-between border rounded-lg p-3 mb-2 bg-gray-50">
                                                <span>
                                                    front
                                                </span>

                                                <span className="text-yellow-700">
                                                    {
                                                        uploadedDocs[
                                                            doc.id
                                                        ]
                                                            .status
                                                    }
                                                </span>
                                            </div>
                                        ) : (
                                            doc.uploaded_files?.map(
                                                (
                                                    file
                                                ) => (
                                                    <div
                                                        key={
                                                            file.id
                                                        }
                                                        className="flex justify-between border rounded-lg p-3 mb-2 bg-gray-50"
                                                    >
                                                        <span>
                                                            {
                                                                file.side
                                                            }
                                                        </span>

                                                  <span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    (file.verification_status || file.status) ===
    "approved"
      ? "bg-green-100 text-green-700"
      : (file.verification_status || file.status) ===
        "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {file.verification_status || file.status}
</span>
                                                    </div>
                                                )
                                            )
                                        )}
                                    </div>
                                )}
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button
                        type="button"
                        onClick={
                            handleFinalizeApplication
                        }
                        disabled={
                            !allMandatoryUploaded ||
                            submitting
                        }
                        className={`w-full py-3 rounded-xl text-white font-semibold ${allMandatoryUploaded
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {submitting
                            ? "Submitting..."
                            : allMandatoryUploaded
                                ? "Submit Application"
                                : "Upload Required Documents First"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DocumentUpload;