import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CloudArrowUpIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import aiApi from '../api/aiApi';
import uploadApi from '../api/uploadApi';

export default function ProcessFile() {
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const uploadSelectedFile = async (file: File) => {
    const uploadRes = await uploadApi.uploadFile(file);
    setUploadedFileUrl(uploadRes.fileUrl);
    setFileUrl(uploadRes.fileUrl);
    return uploadRes.fileUrl;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = fileUrl.trim();
    const hasLocalFile = !!selectedFile;

    if (!trimmed && !hasLocalFile) {
      setError('Please upload a file or provide a file URL');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const finalFileUrl = hasLocalFile
        ? await uploadSelectedFile(selectedFile as File)
        : trimmed;

      const res = await aiApi.extractText(finalFileUrl);
      navigate(`/jobs/${res.jobId}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to start processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Process File</h1>
          <p className="mt-1 text-sm text-gray-600">
            Start a new background job (AI extract-text) using a publicly accessible file URL.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back to Jobs
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-700">Upload file</p>
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);

                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                setSelectedFile(file);
                setUploadedFileUrl(null);
              }}
              className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <DocumentArrowUpIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
              <p className="mt-2 text-sm text-gray-700">
                Drag and drop a PDF/image here, or
              </p>
              <label className="mt-2 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                Choose file
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSelectedFile(file);
                    setUploadedFileUrl(null);
                  }}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">Max 5MB • PDF or image</p>

              {selectedFile && (
                <div className="mt-4 w-full rounded-md bg-gray-50 px-3 py-2 text-left text-sm text-gray-700">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">Selected:</div>
                      <div className="break-all">{selectedFile.name}</div>
                      <div className="text-xs text-gray-500">{Math.round(selectedFile.size / 1024)} KB</div>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadedFileUrl(null);
                      }}
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700">
              File URL (optional)
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Example: a Cloudinary / S3 / public HTTPS URL to a PDF/image.
            </p>
            <input
              id="fileUrl"
              name="fileUrl"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              disabled={isSubmitting}
            />
            {uploadedFileUrl && (
              <p className="mt-2 text-xs text-green-700">
                Uploaded successfully. Using URL: <span className="font-mono">{uploadedFileUrl}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/jobs"
              className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
            >
              <CloudArrowUpIcon className="h-5 w-5" aria-hidden="true" />
              {isSubmitting ? 'Starting...' : 'Start Processing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
