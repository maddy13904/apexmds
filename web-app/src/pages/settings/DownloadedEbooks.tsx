import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { BookOpen } from "lucide-react";

interface DownloadedBook {
  bookId: string;
  title: string;
  pdfUrl: string;
}

export default function DownloadedEbooks() {

  const [downloadedBooks, setDownloadedBooks] = useState<DownloadedBook[]>([]);

  useEffect(() => {
    loadDownloadedBooks();
  }, []);

  async function loadDownloadedBooks() {

  try {

    const downloadsRes = await API.get("/users/downloads");
    const ebooksRes = await API.get("/ebooks");

    const downloads = downloadsRes.data.ebooks || [];
    const allEbooks = ebooksRes.data || [];

    const formatted = downloads.map((download: any) => {

      const ebookMatch = allEbooks.find(
        (ebook: any) => ebook.title === download.title
      );

      return {
        bookId: download.contentId,
        title: download.title,
        pdfUrl: ebookMatch?.pdfUrl || ""
      };

    });

    setDownloadedBooks(formatted);

  } catch (error) {

    console.error("Error loading downloads:", error);

  }

}

  async function deleteBook(bookId: string) {

    try {

      await API.delete(`/users/downloads/${bookId}`);

      setDownloadedBooks((prev) =>
        prev.filter((b) => b.bookId !== bookId)
      );

    } catch (error) {

      console.error("Delete failed", error);

    }

  }

  async function clearAllDownloads() {

    try {

      for (const book of downloadedBooks) {
        await API.delete(`/users/downloads/${book.bookId}`);
      }

      setDownloadedBooks([]);

    } catch (error) {

      console.error("Clear failed", error);

    }

  }

  return (
    <Layout>

      <div className="max-w-5xl mx-auto space-y-8">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Downloaded E-Books
          </h1>

          <p className="text-sm text-slate-500">
            Access your saved study materials
          </p>
        </div>

        {/* EMPTY STATE */}

        {downloadedBooks.length === 0 && (

          <div className="text-center py-20 text-slate-500">

            <div className="text-5xl mb-3">☁️</div>

            <p className="font-medium">
              No downloaded books yet
            </p>

            <p className="text-sm">
              Download e-books to access them offline
            </p>

          </div>

        )}

        {/* BOOKS GRID */}

        {downloadedBooks.length > 0 && (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {downloadedBooks.map((book) => {

  const fileIdMatch = book.pdfUrl?.match(/id=([^&]+)/);
  const fileId = fileIdMatch ? fileIdMatch[1] : null;

  const viewUrl = fileId
    ? `https://drive.google.com/file/d/${fileId}/view`
    : book.pdfUrl;

  return (

    <Card key={book.bookId}>

      {/* ICON + TITLE */}
      <div className="flex items-start gap-3">

        <div className="p-2 bg-blue-50 rounded-lg">
          <BookOpen className="w-5 h-5 text-blue-700" />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">
            {book.title}
          </h3>

          <p className="text-sm text-slate-500">
            Available Offline
          </p>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex gap-3">

        <a
  href={viewUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="flex-1"
>
  <Button>
    View
  </Button>
</a>

        <button
          onClick={() => deleteBook(book.bookId)}
          className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition"
        >
          Delete
        </button>

      </div>

    </Card>

  );

})}

          </div>

        )}

        {downloadedBooks.length > 0 && (

          <button
            onClick={clearAllDownloads}
            className="bg-red-100 text-red-600 px-4 py-3 rounded-lg"
          >
            Delete All Downloads
          </button>

        )}

      </div>

    </Layout>
  );
}