'use client';

import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import Image from 'next/image';

// データの型定義
interface Sheet {
  type: string;
  urls: string[];
}

interface Album {
  name: string;
  artist: string;
  youtube: string;
  sheets: Sheet[];
}

interface Song {
  title: string;
  albums: Album[];
}

export default function Page() {
  const [data, setData] = useState<Song[]>([]);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [currentSheet, setCurrentSheet] = useState<Sheet | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  useEffect(() => {
    // JSONファイルからデータを取得
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const openModal = (sheet: Sheet) => {
    setCurrentSheet(sheet);
    setCurrentPageIndex(0);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  // 曲名でソート
  const sortedSongs = data.sort((a, b) => a.title.localeCompare(b.title));

  const nextPage = () => {
    setCurrentPageIndex(
      (prevIndex) => (prevIndex + 1) % (currentSheet?.urls.length || 1)
    );
  };

  const prevPage = () => {
    setCurrentPageIndex(
      (prevIndex) =>
        (prevIndex - 1 + (currentSheet?.urls.length || 1)) %
        (currentSheet?.urls.length || 1)
    );
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
                        className="btn border border-red-600 text-red-600 bg-white hover:bg-red-50"
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

      <dialog
        ref={modalRef as MutableRefObject<HTMLDialogElement>}
        className="modal"
        onClick={closeModal}
      >
        <div
          className="modal-box relative w-auto max-w-none"
          onClick={(e) => e.stopPropagation()}
        >
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
                <Image
                  src={currentSheet.urls[currentPageIndex]}
                  alt="Transcription"
                  width={800}  // 必要な幅に合わせて設定
                  height={600} // 必要な高さに合わせて設定
                  layout="responsive"
                  quality={75} // 画像のクオリティを指定
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="flex-1 w-full h-auto object-cover"
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