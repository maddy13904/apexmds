import { useLocation } from "react-router-dom";
import { BookOpen, Download, Eye } from "lucide-react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import API from "../api/api";

export default function SubjectTopics() {

  const location = useLocation();
  const topics = location.state?.topics || [];

  async function handleDownload(book: any, downloadUrl: string) {

    try {

      await API.post("/users/downloads", {
        contentId: book._id,
        title: book.title,
        type: "ebook"
      });

      window.open(downloadUrl, "_blank");

    } catch (err) {

      console.error("Download sync failed", err);

    }

  }

  return (

    <Layout>

      <div className="space-y-8">

        <h1 className="text-2xl font-bold text-slate-900">
          Books
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {topics.map((book: any) => {

            const fileIdMatch = book.pdfUrl.match(/id=([^&]+)/);
            const fileId = fileIdMatch ? fileIdMatch[1] : null;

            const viewUrl = fileId
              ? `https://drive.google.com/file/d/${fileId}/preview`
              : book.pdfUrl;

            const downloadUrl = fileId
              ? `https://drive.google.com/uc?export=download&id=${fileId}`
              : book.pdfUrl;

            return (

              <Card key={book._id}>

                {/* Book Icon */}

                <div className="flex items-center gap-3 mb-4">

                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-700" />
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    {book.title}
                  </h3>

                </div>

                {/* Actions */}

                <div className="mt-4 flex gap-3">

                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </a>

                  <div className="flex-1">
                    <Button
                      variant="secondary"
                      className="flex items-center justify-center gap-3"
                      onClick={() => handleDownload(book, downloadUrl)}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>

                </div>

              </Card>

            );

          })}

        </div>

      </div>

    </Layout>

  );

}