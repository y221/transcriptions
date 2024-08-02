'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState([]);
  const modalRef = useRef(null);
  const [currentSheet, setCurrentSheet] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    // JSONファイルからデータを取得
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const openModal = (sheet) => {
    setCurrentSheet(sheet);
    setCurrentPageIndex(0);
    modalRef.current.showModal();
  };

  // 曲名でソート
  const sortedSongs = data.sort((a, b) => a.title.localeCompare(b.title));

  const nextPage = () => {
    setCurrentPageIndex(
      (prevIndex) => (prevIndex + 1) % currentSheet.urls.length
    );
  };

  const prevPage = () => {
    setCurrentPageIndex(
      (prevIndex) =>
        (prevIndex - 1 + currentSheet.urls.length) % currentSheet.urls.length
    );
  };

  const closeModal = () => {
    modalRef.current.close();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Transcriptions</h1>
      <div className="space-y-4">
        {sortedSongs.map((song, index) => (
          <div
            key={index}
            className="collapse collapse-arrow bg-white rounded-lg shadow-md"
          >
            <input
              type="radio"
              name="my-accordion-2"
              defaultChecked={index === 0}
            />
            <div className="collapse-title text-xl font-medium p-4">
              {song.title}
            </div>
            <div className="collapse-content space-y-4">
              {song.albums.map((album, albumIndex) => (
                <div key={albumIndex}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <div className="text-left mb-2 md:mb-0">
                      <div className="text-lg font-semibold">{album.name}</div>
                      <div className="text-sm text-gray-600">
                        {album.artist}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {album.sheets.map((sheet, sheetIndex) => (
                        <button
                          key={sheetIndex}
                          onClick={() => openModal(sheet)}
                          className={`btn ${
                            sheet.type === 'Solo'
                              ? 'btn-primary'
                              : 'btn-secondary'
                          }`}
                        >
                          {sheet.type}
                        </button>
                      ))}
                      <a
                        href={album.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn border border-red-600 text-red-600 bg-white hover:bg-red-600 hover:text-white"
                        style={{ borderColor: '#FF0000', color: '#FF0000' }}
                      >
                        YouTube
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <dialog ref={modalRef} className="modal" onClick={closeModal}>
        <div className="modal-box relative w-auto max-w-none" onClick={(e) => e.stopPropagation()}>
          {currentSheet && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  className="btn btn-accent"
                  onClick={prevPage}
                  disabled={currentSheet.urls.length <= 1}
                >
                  &larr;
                </button>
                <span>
                  {currentPageIndex + 1} / {currentSheet.urls.length}
                </span>
                <button
                  className="btn btn-accent"
                  onClick={nextPage}
                  disabled={currentSheet.urls.length <= 1}
                >
                  &rarr;
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={currentSheet.urls[currentPageIndex]}
                  alt="Transcription"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            </div>
          )}
          <form method="dialog" className="modal-backdrop">
            <button className="hidden">close</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}