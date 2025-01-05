'use client';

import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import SVGDisplay from "@/components/SVGDisplay";

// データの型定義
interface Sheet {
  type: string;
  filePaths: string[];
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
    setCurrentSheet(null);
  };

  // 曲名でソート
  const sortedSongs = data.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Transcriptions</h1>
      
      <div className="space-y-4 max-w-4xl mx-auto">
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
          className="modal-box relative w-auto max-w-none overflow-hidden p-0"
          onClick={(e) => e.stopPropagation()}
        >
          {currentSheet && (
            <div>
              <div className="flex justify-center">
                <SVGDisplay filePaths={currentSheet.filePaths} defaultBpm={120}/>
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