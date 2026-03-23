import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

interface Paper {
  _id: string;
  year: number;
  paperNumber: number;
  pdfUrl: string;
  totalQuestions: number;
}

export default function PreviousPapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");

  useEffect(() => {
    fetchPapers();
  }, []);

  async function fetchPapers() {
    try {
      const res = await API.get("/papers");
      setPapers(res.data);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  }

  function getPreviewUrl(url: string) {
    const match = url.match(/id=([^&]+)/);
    const fileId = match ? match[1] : null;

    return fileId
      ? `https://drive.google.com/file/d/${fileId}/preview`
      : url;
  }

  const uniqueYears = [
    "All",
    ...Array.from(new Set(papers.map((p) => p.year))).sort(
      (a, b) => b - a
    ),
  ];

  const filteredPapers =
    selectedYear === "All"
      ? papers
      : papers.filter((p) => p.year === selectedYear);

  return (
    <Layout>

      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Previous Year Papers
          </h1>
          <p className="text-sm text-slate-500">
            Practice real NEET MDS exam papers
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4">

          <label className="text-sm text-slate-600">
            Filter by Year
          </label>

          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "All"
                  ? "All"
                  : Number(e.target.value)
              )
            }
            className="
            border border-slate-300
            rounded-md
            px-3 py-2
            text-sm
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "
          >
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Paper List */}
          <div className="lg:col-span-1 space-y-4">

            {loading && (
              <p className="text-sm text-slate-500">
                Loading papers...
              </p>
            )}

            {!loading && filteredPapers.length === 0 && (
              <Card>
                <p className="text-sm text-slate-500">
                  No papers available.
                </p>
              </Card>
            )}

            {filteredPapers.map((paper) => (

              <Card key={paper._id}>

                <div
                  onClick={() => setSelectedPaper(paper)}
                  className={`cursor-pointer p-1 rounded-lg transition
                    ${
                      selectedPaper?._id === paper._id
                        ? "bg-slate-100"
                        : "hover:bg-slate-50"
                    }
                  `}
                >

                  <h3 className="font-semibold text-slate-900">
                    NEET MDS {paper.year}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Paper {paper.paperNumber} • {paper.totalQuestions} Questions
                  </p>

                </div>

              </Card>

            ))}

          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">

            {!selectedPaper ? (

              <Card>

                <div className="h-[70vh] flex items-center justify-center">
                  <p className="text-slate-400">
                    Select a paper to preview
                  </p>
                </div>

              </Card>

            ) : (

              <Card>

                <div className="space-y-4">

                  <div className="flex justify-between items-center">

                    <h2 className="text-lg font-semibold text-slate-900">
                      NEET MDS {selectedPaper.year} - Paper {selectedPaper.paperNumber}
                    </h2>

                    <a href={selectedPaper.pdfUrl}>
                      <Button>
                        Download
                      </Button>
                    </a>

                  </div>

                  <div className="h-[70vh] border border-slate-200 rounded-lg overflow-hidden">

                    <iframe
                      src={getPreviewUrl(selectedPaper.pdfUrl)}
                      className="w-full h-full"
                      allow="autoplay"
                    />

                  </div>

                </div>

              </Card>

            )}

          </div>

        </div>

      </div>

    </Layout>
  );
}