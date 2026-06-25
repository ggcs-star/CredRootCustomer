import React, {
    useEffect,
    useState,
    useRef
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getLeadDocuments,
    uploadDocument,
    uploadUserDocument,
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
    const [accountOverview, setAccountOverview] = useState(null);
    const [personalProfile, setPersonalProfile] = useState(null);
    const [businessProfiles, setBusinessProfiles] = useState([]);
    const [loanApplications, setLoanApplications] = useState([]);
    
    // Sectioned documents
    const [personalDocuments, setPersonalDocuments] = useState([]);
    const [businessDocuments, setBusinessDocuments] = useState([]);
    const [loanDocuments, setLoanDocuments] = useState([]);

    const leadId = localStorage.getItem("lead_id");

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            if (!leadId) {
                toast.error("Lead ID not found");
                setLoading(false);
                return;
            }

            const response = await getLeadDocuments(leadId);
            console.log("API Response:", response?.data);

            const responseData = response?.data?.data || {};
            
            // Extract data from the new structure
            const personalProfileData = responseData?.personal_profile || {};
            const businessProfilesData = responseData?.business_profiles || [];
            const loanAppsData = responseData?.loan_applications || [];
            const accountOverviewData = responseData?.account_overview || null;

            // Store the raw data
            setAccountOverview(accountOverviewData);
            setPersonalProfile(personalProfileData);
            setBusinessProfiles(businessProfilesData);
            setLoanApplications(loanAppsData);

            // Process Personal Documents - Use API status directly
            const personalPendingDocs = (personalProfileData?.pending_documents || []).map(doc => ({
                ...doc,
                source: 'personal',
                source_name: 'Personal Profile',
                section: 'personal',
                is_personal: true,
                is_completed: false,
                api_status: 'pending',
                has_uploads: (doc.uploaded_files || []).length > 0,
                is_mandatory: doc.is_mandatory || false,
                company_id: null // Personal documents don't have company_id
            }));
            
            const personalCompletedDocs = (personalProfileData?.completed_documents || []).map(doc => ({
                ...doc,
                source: 'personal',
                source_name: 'Personal Profile',
                section: 'personal',
                is_personal: true,
                is_completed: true,
                api_status: 'completed',
                has_uploads: true,
                is_mandatory: doc.is_mandatory || false,
                company_id: null
            }));
            
            const allPersonalDocs = [...personalPendingDocs, ...personalCompletedDocs];
            setPersonalDocuments(allPersonalDocs);

            // Process Business Documents - Use API status directly
            const allBusinessDocs = [];
            businessProfilesData.forEach(business => {
                const docStatus = business?.document_status || {};
                const pendingDocs = (docStatus?.pending_documents || []).map(doc => ({
                    ...doc,
                    source: 'business',
                    source_name: business.company_name || 'Business Profile',
                    section: 'business',
                    company_id: business.company_id,
                    company_name: business.company_name,
                    entity_type: business.entity_type,
                    is_business: true,
                    is_completed: false,
                    api_status: 'pending',
                    has_uploads: (doc.uploaded_files || []).length > 0,
                    is_mandatory: doc.is_mandatory || false
                }));
                allBusinessDocs.push(...pendingDocs);

                const completedDocs = (docStatus?.completed_documents || []).map(doc => ({
                    ...doc,
                    source: 'business',
                    source_name: business.company_name || 'Business Profile',
                    section: 'business',
                    company_id: business.company_id,
                    company_name: business.company_name,
                    entity_type: business.entity_type,
                    is_business: true,
                    is_completed: true,
                    api_status: 'completed',
                    has_uploads: true,
                    is_mandatory: doc.is_mandatory || false
                }));
                allBusinessDocs.push(...completedDocs);
            });
            setBusinessDocuments(allBusinessDocs);

            // Process Loan Documents - Use API status directly
            const allLoanDocs = [];
            loanAppsData.forEach(loan => {
                const docStatus = loan?.document_status || {};
                const pendingDocs = (docStatus?.pending_documents || []).map(doc => ({
                    ...doc,
                    source: 'loan',
                    source_name: `Loan ${loan.lead_number || ''}`,
                    section: 'loan',
                    lead_id: loan.lead_id,
                    lead_number: loan.lead_number,
                    loan_amount: loan.loan_amount,
                    company_id: loan.company_id,
                    company_name: loan.company_name,
                    is_loan: true,
                    is_completed: false,
                    api_status: 'pending',
                    has_uploads: (doc.uploaded_files || []).length > 0,
                    is_mandatory: doc.is_mandatory || false
                }));
                allLoanDocs.push(...pendingDocs);

                const completedDocs = (docStatus?.completed_documents || []).map(doc => ({
                    ...doc,
                    source: 'loan',
                    source_name: `Loan ${loan.lead_number || ''}`,
                    section: 'loan',
                    lead_id: loan.lead_id,
                    lead_number: loan.lead_number,
                    loan_amount: loan.loan_amount,
                    company_id: loan.company_id,
                    company_name: loan.company_name,
                    is_loan: true,
                    is_completed: true,
                    api_status: 'completed',
                    has_uploads: true,
                    is_mandatory: doc.is_mandatory || false
                }));
                allLoanDocs.push(...completedDocs);
            });
            setLoanDocuments(allLoanDocs);

            // Combine all documents for overall tracking
            const allDocuments = [...allPersonalDocs, ...allBusinessDocs, ...allLoanDocs];
            
            // Remove duplicates based on document id and source
            const uniqueDocs = allDocuments.reduce((acc, current) => {
                const key = `${current.id}-${current.source}-${current.company_id || 'personal'}`;
                if (!acc.find(doc => `${doc.id}-${doc.source}-${doc.company_id || 'personal'}` === key)) {
                    acc.push(current);
                }
                return acc;
            }, []);

            // Process documents with local uploads - use a unique key with source
            const processedDocs = uniqueDocs.map(doc => {
                const localKey = `${doc.id}-${doc.source}-${doc.company_id || 'personal'}`;
                let uploadedFiles = (doc.uploaded_files || []).filter(file => {
                    const hasValidUrl = file.url || file.file_url;
                    const hasValidId = file.id;
                    const hasValidSide = file.side;
                    return hasValidUrl || (hasValidId && hasValidSide);
                }).map(file => {
                    return {
                        ...file,
                        file_url: file.file_url || file.url,
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
                
                const localFiles = localUploads[localKey] || [];
                const allFiles = [...uploadedFiles];
                
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
                    is_uploaded: doc.is_uploaded || (allFiles.length > 0),
                    has_uploads: allFiles.length > 0,
                    localKey: localKey // Store the local key for this document
                };
            });

            setDocuments(processedDocs);
            
            // Update sectioned documents with the processed data
            updateSectionedDocuments(processedDocs);

            // Determine if application can be submitted using API status
            const isPersonalComplete = personalProfileData?.is_all_mandatory_completed || false;
            const allBusinessesComplete = businessProfilesData.every(
                business => business?.document_status?.is_all_mandatory_completed || false
            );
            const loanReadyForSubmission = loanAppsData.some(
                loan => loan?.is_ready_for_submission || false
            );

            const canSubmitOverall = isPersonalComplete && 
                                    (allBusinessesComplete || businessProfilesData.length === 0) &&
                                    (loanReadyForSubmission || loanAppsData.length === 0);

            setCanSubmit(canSubmitOverall);

        } catch (error) {
            console.error("Document Fetch Error:", error);
            toast.error("Failed to fetch documents");
            setDocuments([]);
            setCanSubmit(false);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to update sectioned documents
    const updateSectionedDocuments = (processedDocs) => {
        setPersonalDocuments(processedDocs.filter(doc => doc.section === 'personal'));
        setBusinessDocuments(processedDocs.filter(doc => doc.section === 'business'));
        setLoanDocuments(processedDocs.filter(doc => doc.section === 'loan'));
    };

    // Check if a document's upload is complete based on sides_required
    const isDocumentUploadComplete = (doc) => {
        if (doc.api_status === 'completed' || doc.is_completed) {
            return true;
        }

        const uploadedFiles = (doc.uploaded_files || []).filter(file => 
            file && (file.url || file.file_url || file.id)
        );
        
        const uploadedSides = [...new Set(uploadedFiles.map(file => file.side).filter(Boolean))];
        
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
        if (doc.api_status === 'completed' || doc.is_completed) {
            return [];
        }
        
        const uploadedFiles = (doc.uploaded_files || []).filter(file => 
            file && (file.url || file.file_url || file.id)
        );
        const uploadedSides = new Set(uploadedFiles.map(file => file.side).filter(Boolean));
        const requiredSides = getRequiredSides(doc);
        return requiredSides.filter(side => !uploadedSides.has(side));
    };

    // Check if all mandatory documents are uploaded correctly using API status
    const allMandatoryUploaded = documents
        .filter((doc) => doc.is_mandatory)
        .every((doc) => {
            if (doc.api_status === 'completed' || doc.is_completed) {
                return true;
            }
            return isDocumentUploadComplete(doc);
        });

    const canSubmitApplication = canSubmit && allMandatoryUploaded;

    const handleFileChange = async (documentId, file, side = 'front') => {
        if (!file) return;

        // Find the document to get all its properties
        const doc = documents.find(d => d.id === documentId);
        if (!doc) {
            toast.error("Document not found");
            return;
        }

        const fileKey = `${documentId}-${side}-${doc.source}-${doc.company_id || 'personal'}`;
        const localKey = `${documentId}-${doc.source}-${doc.company_id || 'personal'}`;
        
        setSelectedFiles((prev) => ({
            ...prev,
            [fileKey]: file,
        }));

        try {
            const companyId = doc?.company_id || null;

            setUploadingId(documentId);
            setUploadingSide(side);
            setUploadStatus(prev => ({ ...prev, [fileKey]: 'uploading' }));

            const formData = new FormData();
            formData.append("document_master_id", documentId);
            formData.append("document_side", side);
            formData.append("file", file);
            
            // For business documents, add company_id
            if (companyId) {
                formData.append("company_id", companyId);
            }

            console.log("Uploading with data:", {
                document_master_id: documentId,
                document_side: side,
                company_id: companyId,
                file: file.name,
                section: doc.section
            });

            let response;
            // Use different API for personal vs business documents
            if (doc.section === 'personal') {
                response = await uploadUserDocument(formData);
            } else {
                // For business and loan documents, include lead_id
                formData.append("lead_id", leadId);
                response = await uploadDocument(formData);
            }

            console.log("Upload Response:", response?.data);

            const fileUrl = response?.data?.data?.file_url || 
                           response?.data?.data?.url || 
                           null;

            const uploadedFile = {
                id: response?.data?.data?.document_id || Date.now(),
                side: side,
                file_name: file.name,
                original_name: file.name,
                file_url: fileUrl,
                url: fileUrl,
                uploaded_at: new Date().toISOString(),
                is_local: true,
                status: response?.data?.data?.status || 'uploaded',
                ...(response?.data?.data || {})
            };

            // Store in local uploads with the unique key
            setLocalUploads(prev => {
                const currentFiles = prev[localKey] || [];
                const filteredFiles = currentFiles.filter(f => f.side !== side);
                return {
                    ...prev,
                    [localKey]: [...filteredFiles, uploadedFile]
                };
            });

            // Update documents - only update the specific document
            setDocuments((prev) =>
                prev.map((d) => {
                    // Match by id AND source AND company_id to ensure we only update the right document
                    const matchId = d.id === documentId;
                    const matchSource = d.source === doc.source;
                    const matchCompany = (d.company_id || null) === (doc.company_id || null);
                    
                    if (matchId && matchSource && matchCompany) {
                        const existingFiles = (d.uploaded_files || []).filter(f => 
                            f && (f.file_url || f.url || f.id)
                        );
                        
                        const filteredExisting = existingFiles.filter(f => f.side !== side);
                        
                        const fileExists = filteredExisting.some(f => 
                            f.id === uploadedFile.id || 
                            (f.file_name === uploadedFile.file_name && f.side === uploadedFile.side)
                        );

                        let updatedDoc = {
                            ...d,
                            uploaded_files: fileExists ? filteredExisting : [...filteredExisting, uploadedFile],
                            has_uploads: true,
                            api_status: d.api_status === 'pending' ? 'partial' : d.api_status
                        };
                        
                        if (updatedDoc.uploaded_files.length > 0) {
                            updatedDoc.is_uploaded = true;
                        }
                        
                        return updatedDoc;
                    }
                    return d;
                })
            );

            // Update sectioned documents
            setDocuments((prev) => {
                const updated = [...prev];
                // Update sectioned states
                updateSectionedDocuments(updated);
                return updated;
            });

            setSelectedFiles((prev) => ({
                ...prev,
                [fileKey]: null
            }));

            setUploadStatus(prev => ({ ...prev, [fileKey]: 'success' }));

            toast.success(response?.data?.message || `${side.charAt(0).toUpperCase() + side.slice(1)} side uploaded successfully`);

            // Refresh from server after a delay
            setTimeout(() => {
                fetchDocuments();
            }, 3000);

        } catch (error) {
            console.error("Upload Error:", error);
            setUploadStatus(prev => ({ ...prev, [fileKey]: 'error' }));
            toast.error(error?.response?.data?.message || "Upload Failed");
        } finally {
            setUploadingId(null);
            setUploadingSide(null);
        }
    };

    const handleFinalizeApplication = async () => {
        try {
            if (!leadId) {
                toast.error("Lead ID not found");
                return;
            }

            if (!allMandatoryUploaded) {
                toast.error("Please upload all mandatory documents before submitting.");
                return;
            }

            setSubmitting(true);

            const response = await finalizeApplication(leadId);

            toast.success(response?.data?.message || "Application Submitted Successfully");

            setLocalUploads({});
            await fetchDocuments();
            
            navigate('/dashboard');
            
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed To Submit Application");
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
        if (file.url || file.file_url) {
            const url = file.url || file.file_url;
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (fileName && fileName !== 'undefined' && fileName !== 'null') {
                return fileName;
            }
        }
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

    // Check if a file is valid
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

    // Get section status using API data
    const getSectionStatus = (docs, sectionType) => {
        const mandatoryDocs = docs.filter(doc => doc.is_mandatory);
        
        if (mandatoryDocs.length === 0) {
            if (docs.length === 0) {
                return { status: 'complete', text: 'No documents required', isComplete: true };
            }
            return { status: 'complete', text: 'No mandatory documents', isComplete: true };
        }
        
        const allCompleted = mandatoryDocs.every(doc => {
            if (doc.api_status === 'completed' || doc.is_completed) {
                return true;
            }
            const uploadedFiles = (doc.uploaded_files || []).filter(file => isValidFile(file));
            if (uploadedFiles.length === 0) return false;
            const requiredSides = getRequiredSides(doc);
            const uploadedSides = [...new Set(uploadedFiles.map(f => f.side).filter(Boolean))];
            return requiredSides.every(side => uploadedSides.includes(side));
        });
        
        const total = mandatoryDocs.length;
        const completed = mandatoryDocs.filter(doc => {
            if (doc.api_status === 'completed' || doc.is_completed) {
                return true;
            }
            const uploadedFiles = (doc.uploaded_files || []).filter(file => isValidFile(file));
            if (uploadedFiles.length === 0) return false;
            const requiredSides = getRequiredSides(doc);
            const uploadedSides = [...new Set(uploadedFiles.map(f => f.side).filter(Boolean))];
            return requiredSides.every(side => uploadedSides.includes(side));
        }).length;
        
        if (allCompleted) {
            return { status: 'complete', text: `✓ Complete (${completed}/${total})`, isComplete: true };
        } else if (completed > 0) {
            return { status: 'partial', text: `⏳ Partial (${completed}/${total})`, isComplete: false };
        } else {
            return { status: 'pending', text: `⏳ Pending (${completed}/${total})`, isComplete: false };
        }
    };

    // Render document cards for a section
    const renderDocumentCards = (docs, sectionTitle, sectionKey) => {
        if (docs.length === 0) {
            return (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl">
                    <p>No documents found for {sectionTitle}</p>
                </div>
            );
        }

        // Separate mandatory and optional documents
        const mandatoryDocs = docs.filter(doc => doc.is_mandatory);
        const optionalDocs = docs.filter(doc => !doc.is_mandatory);

        const renderDocGroup = (docGroup, groupTitle) => {
            return docGroup.map((doc) => {
                const uploadedFiles = (doc.uploaded_files || []).filter(file => isValidFile(file));
                const hasUploadedFiles = uploadedFiles.length > 0;
                const isUploading = uploadingId === doc.id;
                const isComplete = isDocumentUploadComplete(doc);
                const missingSides = getMissingSides(doc);
                const requiredSides = getRequiredSides(doc);
                const isFromCompleted = doc.api_status === 'completed' || doc.is_completed;

                return (
                    <div key={`${doc.id}-${doc.source}-${doc.company_id || 'personal'}`} className={`border rounded-2xl p-6 bg-white my-2 ${
                        isFromCompleted ? 'border-green-200 bg-green-50/30' : 
                        isComplete ? 'border-green-200' : 'border-gray-200'
                    }`}>
                        <div className="flex flex-col lg:flex-row justify-between gap-5">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-xl font-semibold text-black">{doc.name}</h3>
                                    {doc.company_name && (
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">
                                            {doc.company_name}
                                        </span>
                                    )}
                                    {doc.lead_number && (
                                        <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-xs">
                                            {doc.lead_number}
                                        </span>
                                    )}
                                    {isFromCompleted && (
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                                            ✓ Completed
                                        </span>
                                    )}
                                </div>
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
                                    {missingSides.length > 0 && !isComplete && !isFromCompleted && (
                                        <p className="text-red-600 text-sm">
                                            <strong>Missing:</strong> {missingSides.join(', ')}
                                        </p>
                                    )}
                                    {isFromCompleted && (
                                        <p className="text-green-600 text-sm">
                                            <strong>Status:</strong> Already uploaded
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
                                    {isFromCompleted ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">✓ Uploaded</span>
                                    ) : isUploading ? (
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
                            {requiredSides.map((side) => {
                                const hasSide = uploadedFiles.some(f => f.side === side);
                                const fileKey = `${doc.id}-${side}-${doc.source}-${doc.company_id || 'personal'}`;
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
                                                {isFromCompleted && (
                                                    <span className="text-gray-500 ml-2">(Already uploaded)</span>
                                                )}
                                            </label>
                                            <input
                                                ref={el => fileInputRef.current[fileKey] = el}
                                                type="file"
                                                disabled={isSideUploading || hasSide || isComplete || isFromCompleted}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileChange(doc.id, file, side);
                                                    }
                                                    e.target.value = '';
                                                }}
                                                className={`w-full border rounded-xl px-4 py-3 bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                                                    isFromCompleted ? 'border-green-300 bg-gray-50 cursor-not-allowed opacity-60' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>

                                        {selectedFiles[fileKey] && !isSideUploading && !hasSide && !isFromCompleted && (
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

                                                <div className="flex gap-3 mt-1 flex-wrap">
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

                        {!hasUploadedFiles && !isUploading && !isFromCompleted && (
                            <div className="mt-5 text-sm text-gray-400">
                                No files uploaded yet. Please upload the required side(s).
                            </div>
                        )}
                        
                        {isFromCompleted && !hasUploadedFiles && (
                            <div className="mt-5 text-sm text-green-600">
                                This document has been completed. No action needed.
                            </div>
                        )}
                    </div>
                );
            });
        };

        return (
            <div className="space-y-6">
                {mandatoryDocs.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Mandatory Documents ({mandatoryDocs.length})
                        </h4>
                        {renderDocGroup(mandatoryDocs, 'Mandatory')}
                    </div>
                )}
                
                {optionalDocs.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Optional Documents ({optionalDocs.length})
                        </h4>
                        {renderDocGroup(optionalDocs, 'Optional')}
                    </div>
                )}
            </div>
        );
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
                
                {/* Account Overview Summary Cards */}
                {accountOverview && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className={`rounded-lg p-4 border ${
                            accountOverview.personal_kyc_complete 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-yellow-50 border-yellow-200'
                        }`}>
                            <p className="text-sm text-gray-600">Personal KYC</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {accountOverview.personal_kyc_complete ? '✅ Complete' : '⏳ Pending'}
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-gray-600">Total Businesses</p>
                            <p className="text-lg font-semibold text-gray-900">{accountOverview.total_businesses}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-sm text-gray-600">Loans In Progress</p>
                            <p className="text-lg font-semibold text-gray-900">{accountOverview.total_loans_in_progress}</p>
                        </div>
                        <div className={`rounded-lg p-4 border ${
                            canSubmit ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                            <p className="text-sm text-gray-600">Application Status</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {canSubmit ? '✅ Ready to Submit' : '⏳ In Progress'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Section Navigation / Status */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`rounded-lg p-3 text-center ${
                    getSectionStatus(personalDocuments, 'personal').status === 'complete' 
                        ? 'bg-green-100 border border-green-300' 
                        : getSectionStatus(personalDocuments, 'personal').status === 'partial'
                        ? 'bg-yellow-100 border border-yellow-300'
                        : 'bg-gray-100 border border-gray-300'
                }`}>
                    <h4 className="font-semibold text-gray-700">Personal Profile</h4>
                    <p className="text-sm text-gray-600">{getSectionStatus(personalDocuments, 'personal').text}</p>
                </div>
                <div className={`rounded-lg p-3 text-center ${
                    getSectionStatus(businessDocuments, 'business').status === 'complete' 
                        ? 'bg-green-100 border border-green-300' 
                        : getSectionStatus(businessDocuments, 'business').status === 'partial'
                        ? 'bg-yellow-100 border border-yellow-300'
                        : 'bg-gray-100 border border-gray-300'
                }`}>
                    <h4 className="font-semibold text-gray-700">Business Profile</h4>
                    <p className="text-sm text-gray-600">{getSectionStatus(businessDocuments, 'business').text}</p>
                </div>
                <div className={`rounded-lg p-3 text-center ${
                    getSectionStatus(loanDocuments, 'loan').status === 'complete' 
                        ? 'bg-green-100 border border-green-300' 
                        : getSectionStatus(loanDocuments, 'loan').status === 'partial'
                        ? 'bg-yellow-100 border border-yellow-300'
                        : 'bg-gray-100 border border-gray-300'
                }`}>
                    <h4 className="font-semibold text-gray-700">Loan Application</h4>
                    <p className="text-sm text-gray-600">{getSectionStatus(loanDocuments, 'loan').text}</p>
                </div>
            </div>

            {/* Personal Profile Section */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">1</span>
                        Personal Profile Documents
                        {personalProfile && (
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                ({personalProfile.pending_mandatory_count || 0} pending mandatory)
                            </span>
                        )}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        getSectionStatus(personalDocuments, 'personal').status === 'complete' 
                            ? 'bg-green-100 text-green-700' 
                            : getSectionStatus(personalDocuments, 'personal').status === 'partial'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                        {getSectionStatus(personalDocuments, 'personal').text}
                    </span>
                </div>
                <div className="space-y-6">
                    {renderDocumentCards(personalDocuments, 'Personal Profile', 'personal')}
                </div>
            </div>

            {/* Business Profiles Section */}
            {businessProfiles.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">2</span>
                            Business Profile Documents
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            getSectionStatus(businessDocuments, 'business').status === 'complete' 
                                ? 'bg-green-100 text-green-700' 
                                : getSectionStatus(businessDocuments, 'business').status === 'partial'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {getSectionStatus(businessDocuments, 'business').text}
                        </span>
                    </div>
                    
                    {/* Show business profile summary */}
                    {businessProfiles.map((business, index) => (
                        <div key={business.company_id} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <div>
                                    <h4 className="font-semibold text-gray-800">{business.company_name}</h4>
                                    <p className="text-sm text-gray-600">Entity: {business.entity_type}</p>
                                    <p className="text-sm text-gray-600">
                                        Pending mandatory: {business.pending_mandatory_count || 0}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    business.is_kyc_complete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {business.is_kyc_complete ? '✓ KYC Complete' : '⏳ KYC Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    <div className="space-y-6">
                        {renderDocumentCards(businessDocuments, 'Business Profile', 'business')}
                    </div>
                </div>
            )}

            {/* Loan Applications Section */}
            {loanApplications.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm">3</span>
                            Loan Application Documents
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            getSectionStatus(loanDocuments, 'loan').status === 'complete' 
                                ? 'bg-green-100 text-green-700' 
                                : getSectionStatus(loanDocuments, 'loan').status === 'partial'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {getSectionStatus(loanDocuments, 'loan').text}
                        </span>
                    </div>
                    
                    {/* Show loan application summary */}
                    {loanApplications.map((loan) => (
                        <div key={loan.lead_id} className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <div>
                                    <h4 className="font-semibold text-gray-800">Loan #{loan.lead_number}</h4>
                                    <p className="text-sm text-gray-600">Amount: ₹{parseFloat(loan.loan_amount).toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">Company: {loan.company_name}</p>
                                    <p className="text-sm text-gray-600">
                                        Pending mandatory: {loan.pending_mandatory_count || 0}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    loan.is_ready_for_submission ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {loan.is_ready_for_submission ? '✓ Ready for Submission' : '⏳ In Progress'}
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    <div className="space-y-6">
                        {renderDocumentCards(loanDocuments, 'Loan Application', 'loan')}
                    </div>
                </div>
            )}

            {/* Submit Button */}
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