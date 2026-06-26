
import { Hero } from "../components/Hero";
import UploadCard from "../components/UploadCard";
import useHeadshot from "../hook/useHeadshot";
import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import TransformationGrid from "../components/TransformationGrid";
import ResultPreview from "../components/ResultPreview";
import ExportActions from "../components/ExportActions";


function Home() {
  const headshot = useHeadshot();
  return (
    <div className="min-h-screen ">
      <header className="border-b border-white/10 px-10 py-4">
        <div className="text-2xl font-bold flex items-center ">
          <span><img src="/logo.png" className="h-20 " /></span>
          <span className="pb-4">
            Glint AI <span className="text-indigo-400">Headshots</span>
          </span>
        </div>
      </header>
      <Hero />
      <UploadCard
        uploadStatus={headshot.uploadStatus}
        uploadError={headshot.uploadError}
        onUploadStart={headshot.handleUploadStart}
        onUploadError={headshot.handleUploadError}
        onUploadSuccess={headshot.handleUploadSuccess}
      />

      {headshot.hasUpload && headshot.originalImage && (
        <section className="px-4 py-8">
          <div className="mx-auto max-w-md text-center">
            <h2 className="mb-4 text-xl font-semibold">Original Upload</h2>
            <AdvancedImage
              cldImg={headshot.originalImage}
              plugins={[placeholder({ mode: "blur" }), lazyload()]}
              alt="Original Upload"
              className="mx-auto rounded-xl shadow-lg"
            />
          </div>
        </section>
      )}

      {headshot.hasUpload && (
        <TransformationGrid
          title="AI Headshot Styles"
          presets={headshot.presetImages}
          onSelect={headshot.selectPreset}
          selectedPresetId={headshot.selectedPresetId}
        />
      )}

      {headshot.hasUpload && (
        <ResultPreview
          originalImage={headshot.originalImage}
          selectedImage={headshot.selectedImage}
          selectedPreset={headshot.selectedPreset}
        />
      )}

      {headshot.hasUpload && headshot.publicId && headshot.selectedPreset && (
        <ExportActions
          publicId={headshot.publicId}
          selectedPreset={headshot.selectedPreset}
        />
      )}

      <footer className="border-t border-white/10 px-4 py-6 text-center text-md text-slate-400">
        Made with love 💜 by <span className="font-bold "> Karthik Vinod</span>
      </footer>
    </div>
  );
}

export default Home;
