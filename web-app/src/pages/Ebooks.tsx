import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/api";
import Card from "../components/ui/Card";
import { useNavigate } from "react-router-dom";
import { BookOpenIcon } from "@heroicons/react/24/outline";

interface Ebook {
  _id: string;
  subject: string;
  title: string;
  pdfUrl: string;
}

interface SubjectGroup {
  title: string;
  topics: Ebook[];
}

export default function Ebooks() {

  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<SubjectGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEbooks();
  }, []);

  async function fetchEbooks() {

    try {

      const res = await API.get("/ebooks");
      const books: Ebook[] = res.data;

      const grouped: Record<string, Ebook[]> = {};

      books.forEach((book) => {

        if (!grouped[book.subject]) {
          grouped[book.subject] = [];
        }

        grouped[book.subject].push(book);

      });

      const subjectArray: SubjectGroup[] =
        Object.keys(grouped).map((subject) => ({
          title: subject,
          topics: grouped[subject]
        }));

      setSubjects(subjectArray);

    } catch (error) {

      console.error("Error fetching ebooks:", error);

    } finally {

      setLoading(false);

    }
  }

  return (
    <Layout>

      <div className="space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            E-Books Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access NEET MDS preparation materials
          </p>
        </div>

        {loading && (
          <p className="text-slate-500">Loading subjects...</p>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {subjects.map((subject) => (

              <Card key={subject.title}>

  <div
    onClick={() =>
      navigate(`/ebooks/${subject.title}`, {
        state: { topics: subject.topics }
      })
    }
    className="cursor-pointer flex items-center gap-4 p-2"
  >

    {/* ICON */}
    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
      <BookOpenIcon className="w-5 h-5 text-blue-600" />
    </div>

    {/* SUBJECT INFO */}
    <div>

      <h3 className="text-lg font-semibold text-slate-900">
        {subject.title}
      </h3>

      <p className="text-sm text-slate-500">
        {subject.topics.length} Books Available
      </p>

    </div>

  </div>

</Card>

            ))}

          </div>
        )}

      </div>

    </Layout>
  );
}