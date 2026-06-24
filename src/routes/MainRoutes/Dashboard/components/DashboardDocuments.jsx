import React, {
    useEffect,
    useState,
    useRef
} from "react";
import { useNavigate } from "react-router-dom";

import {
    getLeadDocuments,
    uploadDocument,
    finalizeApplication,
} from "../../../../../api";

// Shimmer Effect Component
const DocumentShimmer = () => {
    return (
        <div>
            <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
            </div>

            <div className="animate-pulse">
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="border border-gray-200 rounded-2xl p-6 bg-white">
                            <div className="flex flex-col lg:flex-row justify-between gap-5">
                                <div className="flex-1">
                                    <div className="h-7 bg-gray-200 rounded w-1/3 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    
                                    <div className="mt-3 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                    <div className="mt-3 h-6 bg-gray-200 rounded-full w-16"></div>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <div className="flex flex-col md:flex-row gap-4 mb-3">
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                        <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-5">
                                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                                <div className="border rounded-lg p-3 bg-gray-50">
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8">
                    <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
                </div>
            </div>
        </div>
    );
};

const DashboardDocuments = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef({});

    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);
    const [uploadingSide, setUploadingSide] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [uploadStatus, setUploadStatus] = useState({});
    const [localUploads, setLocalUploads] = useState({});
    const [canSubmit, setCanSubmit] = useState(false);

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
                setLoading(false);
                return;
            }

            const response = await getLeadDocuments(currentLeadId);
            console.log("API Response:", response?.data);

            // Process documents from API
            const docs = (response?.data?.data?.documents || []).map(doc => {
                // Process uploaded files - handle both 'url' and 'file_url' fields
                let uploadedFiles = (doc.uploaded_files || []).filter(file => {
                    // Check if file has valid data
                    const hasValidUrl = file.url || file.file_url;
                    const hasValidId = file.id;
                    const hasValidSide = file.side;
                    
                    // Keep files that have at least a URL or ID
                    return hasValidUrl || (hasValidId && hasValidSide);
                }).map(file => {
                    // Normalize file object to have consistent properties
                    return {
                        ...file,
                        file_url: file.file_url || file.url,
                        // Extract filename from URL if available
                        file_name: file.file_name || 
                                  file.original_name || 
                                  (file.url ? file.url.split('/').pop() : null) ||
                                  (file.file_url ? file.file_url.split('/').pop() : null) ||
                                  `File ${file.id}`,
                        original_name: file.original_name || file.file_name || 
                                      (file.url ? file.url.split('/').pop() : null) ||
                                      (file.file_url ? file.file_url.split('/').pop() : null) ||
                                      `File ${file.id}`
                    };
                });
                
                // Merge with local uploads if they exist for this document
                const localFiles = localUploads[doc.id] || [];
                
                // Combine local and API files, avoid duplicates
                const allFiles = [...uploadedFiles];
                
                // Add local files that aren't already in the API response
                localFiles.forEach(localFile => {
                    const exists = allFiles.some(f => 
                        f.id === localFile.id || 
                        (f.file_name === localFile.file_name && f.side === localFile.side)
                    );
                    if (!exists) {
                        allFiles.push(localFile);
                    }
                });

                return {
                    ...doc,
                    uploaded_files: allFiles,
                    // Keep the original is_uploaded flag from API
                    is_uploaded: doc.is_uploaded || (allFiles.length > 0)
                };
            });

            setDocuments(docs);
            
            // Update canSubmit based on the API response
            setCanSubmit(response?.data?.data?.can_submit_application || false);

        } catch (error) {
            console.error("Document Fetch Error:", error);
            setDocuments([]);
            setCanSubmit(false);
        } finally {
            setLoading(false);
        }
    };

    // Check if a document's upload is complete based on sides_required
    const isDocumentUploadComplete = (doc) => {
        const uploadedFiles = (doc.uploaded_files || []).filter(file => 
            file && (file.url || file.file_url || file.id)
        );
        
        // Get unique sides that have been uploaded
        const uploadedSides = [...new Set(uploadedFiles.map(file => file.side).filter(Boolean))];
        
        // Check if document is complete based on sides_required (matching backend logic)
        if (doc.sides_required == 0 && uploadedSides.includes('single')) {
            return true;
        } else if (doc.sides_required == 1 && uploadedSides.includes('front')) {
            return true;
        } else if (doc.sides_required == 2 && uploadedSides.includes('front') && uploadedSides.includes('back')) {
            return true;
        }
        
        return false;
    };

    // Get the required sides for a document
    const getRequiredSides = (doc) => {
        if (doc.sides_required == 0) return ['single'];
        if (doc.sides_required == 1) return ['front'];
        if (doc.sides_required == 2) return ['front', 'back'];
        return [];
    };

    // Get missing sides for a document
    const getMissingSides = (doc) => {
        const uploadedFiles = (doc.uploaded_files || []).filter(file => 
            file && (file.url || file.file_url || file.id)
        );
        const uploadedSides = new Set(uploadedFiles.map(file => file.side).filter(Boolean));
        const requiredSides = getRequiredSides(doc);
        return requiredSides.filter(side => !uploadedSides.has(side));
    };

    // Check if all mandatory documents are uploaded correctly
    const allMandatoryUploaded = documents
        .filter((doc) => doc.is_mandatory)
        .every((doc) => isDocumentUploadComplete(doc));

    // Also check if API says can submit
    const canSubmitApplication = canSubmit && allMandatoryUploaded;

    const handleFileChange = async (documentId, file, side = 'front') => {
        if (!file) return;

        const fileKey = `${documentId}-${side}`;
        setSelectedFiles((prev) => ({
            ...prev,
            [fileKey]: file,
        }));

        try {
            if (!leadId) {
                alert("Lead ID not found");
                return;
            }

            setUploadingId(documentId);
            setUploadingSide(side);
            setUploadStatus(prev => ({ ...prev, [fileKey]: 'uploading' }));

            const formData = new FormData();
            formData.append("lead_id", leadId);
            formData.append("document_master_id", documentId);
            formData.append("document_side", side);
            formData.append("file", file);

            const response = await uploadDocument(formData);

            console.log("Upload Response:", response?.data);

            // Get the file URL from response
            const fileUrl = response?.data?.data?.file_url || 
                           response?.data?.data?.url || 
                           null;

            // Create the uploaded file object with proper name
            const uploadedFile = {
                id: response?.data?.data?.id || Date.now(),
                side: side,
                file_name: file.name,
                original_name: file.name,
                file_url: fileUrl,
                url: fileUrl,
                uploaded_at: new Date().toISOString(),
                is_local: true,
                status: response?.data?.data?.status || 'pending',
                ...(response?.data?.data || {})
            };

            // Store in local uploads
            setLocalUploads(prev => {
                const currentFiles = prev[documentId] || [];
                // Remove any existing file with same side
                const filteredFiles = currentFiles.filter(f => f.side !== side);
                return {
                    ...prev,
                    [documentId]: [...filteredFiles, uploadedFile]
                };
            });

            // Update documents with the new file
            setDocuments((prev) =>
                prev.map((doc) => {
                    if (doc.id === documentId) {
                        // Get existing valid files
                        const existingFiles = (doc.uploaded_files || []).filter(f => 
                            f && (f.file_url || f.url || f.id)
                        );
                        
                        // Remove any existing file with same side
                        const filteredExisting = existingFiles.filter(f => f.side !== side);
                        
                        const fileExists = filteredExisting.some(f => 
                            f.id === uploadedFile.id || 
                            (f.file_name === uploadedFile.file_name && f.side === uploadedFile.side)
                        );

                        let updatedDoc = {
                            ...doc,
                            uploaded_files: fileExists ? filteredExisting : [...filteredExisting, uploadedFile]
                        };
                        
                        // Update is_uploaded flag if we have files
                        if (updatedDoc.uploaded_files.length > 0) {
                            updatedDoc.is_uploaded = true;
                        }
                        
                        return updatedDoc;
                    }
                    return doc;
                })
            );

            // Clear selected file
            setSelectedFiles((prev) => ({
                ...prev,
                [fileKey]: null
            }));

            setUploadStatus(prev => ({ ...prev, [fileKey]: 'success' }));

            // Show success message
            alert(response?.data?.message || `${side.charAt(0).toUpperCase() + side.slice(1)} side uploaded successfully`);

            // Refresh from server after a delay to get updated can_submit_application
            setTimeout(() => {
                fetchDocuments();
            }, 3000);

        } catch (error) {
            console.error("Upload Error:", error);
            setUploadStatus(prev => ({ ...prev, [fileKey]: 'error' }));
            alert(error?.response?.data?.message || "Upload Failed");
        } finally {
            setUploadingId(null);
            setUploadingSide(null);
        }
    };

    const handleFinalizeApplication = async () => {
        try {
            if (!leadId) {
                alert("Lead ID not found");
                return;
            }

            // Double check if all mandatory documents are uploaded
            if (!allMandatoryUploaded) {
                alert("Please upload all mandatory documents before submitting.");
                return;
            }

            setSubmitting(true);

            const response = await finalizeApplication(leadId);

            alert(response?.data?.message || "Application Submitted Successfully");

            // Clear local uploads after successful submission
            setLocalUploads({});
            await fetchDocuments();
            
            // Navigate to dashboard or home after successful submission
            navigate('/dashboard');
            
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed To Submit Application");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper function to get display name for file
    const getFileDisplayName = (file) => {
        if (file.file_name && file.file_name !== 'undefined' && file.file_name !== 'null') {
            return file.file_name;
        }
        if (file.original_name && file.original_name !== 'undefined' && file.original_name !== 'null') {
            return file.original_name;
        }
        if (file.name && file.name !== 'undefined' && file.name !== 'null') {
            return file.name;
        }
        // Try to get filename from URL
        if (file.url || file.file_url) {
            const url = file.url || file.file_url;
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (fileName && fileName !== 'undefined' && fileName !== 'null') {
                return fileName;
            }
        }
        // If file has an ID, use it
        if (file.id) {
            return `File ${file.id}`;
        }
        return null;
    };

    // Helper to format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    // Check if a file is valid (has a name, URL, or ID)
    const isValidFile = (file) => {
        if (!file) return false;
        const hasValidFileName = file.file_name && file.file_name !== 'undefined' && file.file_name !== 'null';
        const hasValidOriginalName = file.original_name && file.original_name !== 'undefined' && file.original_name !== 'null';
        const hasValidName = file.name && file.name !== 'undefined' && file.name !== 'null';
        const hasValidUrl = (file.file_url && file.file_url !== 'undefined' && file.file_url !== 'null') || 
                           (file.url && file.url !== 'undefined' && file.url !== 'null');
        const hasValidId = file.id;
        return hasValidFileName || hasValidOriginalName || hasValidName || hasValidUrl || hasValidId;
    };

    // Show shimmer while fetching data
    if (loading) {
        return <DocumentShimmer />;
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                <p className="text-gray-600 mt-1">Upload all required documents to proceed</p>
            </div>

            <div className="space-y-6">
                {documents.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p>No documents found.</p>
                    </div>
                ) : (
                    documents.map((doc) => {
                        // Filter to get only valid uploaded files
                        const uploadedFiles = (doc.uploaded_files || []).filter(file => isValidFile(file));
                        const hasUploadedFiles = uploadedFiles.length > 0;
                        const isUploading = uploadingId === doc.id;
                        const isComplete = isDocumentUploadComplete(doc);
                        const missingSides = getMissingSides(doc);
                        const requiredSides = getRequiredSides(doc);

                        return (
                            <div key={doc.id} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                                <div className="flex flex-col lg:flex-row justify-between gap-5">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-black">{doc.name}</h3>
                                        <p className="text-gray-500 mt-2">{doc.description}</p>

                                        <div className="mt-3 text-sm text-gray-600 space-y-1">
                                            <p><strong>Document Code:</strong> {doc.document_code}</p>
                                            <p><strong>Allowed Formats:</strong> {doc.allowed_formats}</p>
                                            <p><strong>Max Size:</strong> {doc.max_size_kb} KB</p>
                                            <p><strong>Sides Required:</strong> {
                                                doc.sides_required == 0 ? 'Single' :
                                                doc.sides_required == 1 ? 'Front Only' :
                                                'Front & Back'
                                            }</p>
                                            {missingSides.length > 0 && !isComplete && (
                                                <p className="text-red-600 text-sm">
                                                    <strong>Missing:</strong> {missingSides.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        {doc.is_mandatory ? (
                                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">Mandatory</span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Optional</span>
                                        )}

                                        <div className="mt-3">
                                            {isUploading ? (
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Uploading {uploadingSide}...
                                                </span>
                                            ) : isComplete ? (
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">✓ Complete</span>
                                            ) : hasUploadedFiles ? (
                                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Partial ({uploadedFiles.length}/{requiredSides.length})
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    {/* Show upload inputs for each required side */}
                                    {requiredSides.map((side) => {
                                        const hasSide = uploadedFiles.some(f => f.side === side);
                                        const fileKey = `${doc.id}-${side}`;
                                        const isSideUploading = uploadingId === doc.id && uploadingSide === side;
                                        const sideStatus = uploadStatus[fileKey];

                                        return (
                                            <div key={side} className="flex flex-col md:flex-row gap-4 mb-3">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        {side.charAt(0).toUpperCase() + side.slice(1)} Side
                                                        {hasSide && (
                                                            <span className="text-green-600 ml-2">✓ Uploaded</span>
                                                        )}
                                                        {isSideUploading && (
                                                            <span className="text-blue-600 ml-2">Uploading...</span>
                                                        )}
                                                    </label>
                                                    <input
                                                        ref={el => fileInputRef.current[fileKey] = el}
                                                        type="file"
                                                        disabled={isSideUploading || hasSide || isComplete}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleFileChange(doc.id, file, side);
                                                            }
                                                            e.target.value = '';
                                                        }}
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                    />
                                                </div>

                                                {selectedFiles[fileKey] && !isSideUploading && !hasSide && (
                                                    <span className="text-sm text-blue-600 self-center">
                                                        Selected: {selectedFiles[fileKey].name}
                                                    </span>
                                                )}

                                                {sideStatus === 'error' && (
                                                    <span className="text-sm text-red-600 self-center">
                                                        Upload failed. Please try again.
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Show Uploaded Files section only if there are valid uploaded files */}
                                {hasUploadedFiles && (
                                    <div className="mt-5">
                                        <h4 className="font-semibold text-green-600 mb-3">
                                            Uploaded Files ({uploadedFiles.length})
                                        </h4>

                                        {uploadedFiles.map((file, index) => {
                                            const displayName = getFileDisplayName(file);
                                            if (!displayName) return null;
                                            
                                            return (
                                                <div 
                                                    key={file.id || `file-${index}-${Date.now()}`} 
                                                    className="border rounded-lg p-3 mb-2 bg-gray-50 flex justify-between items-center"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-700">
                                                            {displayName}
                                                        </span>

                                                        {(file.file_url || file.url) && (
                                                            <a
                                                                href={file.file_url || file.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:underline"
                                                            >
                                                                View File
                                                            </a>
                                                        )}

                                                        <div className="flex gap-3 mt-1">
                                                            {file.side && (
                                                                <span className="text-xs text-gray-500">
                                                                    Side: {file.side}
                                                                </span>
                                                            )}
                                                            {file.file_size && (
                                                                <span className="text-xs text-gray-500">
                                                                    Size: {formatFileSize(file.file_size)}
                                                                </span>
                                                            )}
                                                            {file.uploaded_at && (
                                                                <span className="text-xs text-gray-500">
                                                                    Uploaded: {new Date(file.uploaded_at).toLocaleString()}
                                                                </span>
                                                            )}
                                                            {file.is_local && (
                                                                <span className="text-xs text-blue-500 font-medium">
                                                                    Just uploaded
                                                                </span>
                                                            )}
                                                            {file.status && (
                                                                <span className="text-xs text-gray-500">
                                                                    Status: {file.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <span className="text-green-700 font-medium">✓ Uploaded</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Show pending message if no files */}
                                {!hasUploadedFiles && !isUploading && (
                                    <div className="mt-5 text-sm text-gray-400">
                                        No files uploaded yet. Please upload the required side(s).
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-8">
                <button
                    type="button"
                    onClick={handleFinalizeApplication}
                    disabled={!canSubmitApplication || submitting}
                    className={`w-full py-3 rounded-xl text-white font-semibold ${
                        canSubmitApplication
                            ? "bg-blue-600 hover:bg-blue-700 transition-colors"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : canSubmitApplication ? (
                        "Submit Application"
                    ) : !allMandatoryUploaded ? (
                        "Upload all mandatory documents completely"
                    ) : (
                        "Application cannot be submitted. Please check all documents."
                    )}
                </button>
            </div>
        </div>
    );
};

export default DashboardDocuments;