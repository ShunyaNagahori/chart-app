'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import LineChart from '@/app/components/LineChart';
import BarChart from '@/app/components/BarChart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';



export default function Home() {
  const [values, setValues] = useState<{ [key: string]: number }>({});
  const [secondValues, setSecondValues] = useState<{ [key: string]: number }>({});
  const [labelInput, setLabelInput] = useState<string>('');
  const [title, setTitle] = useState<string>('タイトル未登録');
  const [numberInput, setNumberInput] = useState<number>(1);
  const [secondNumberInput, setSecondNumberInput] = useState<number>(1);
  const [style, setStyle] = useState<number>(1);
  const [dataName, setDataName] = useState<string>('');
  const [secondDataName, setSecondDataName] = useState<string>('');
  const [selectedDataCountValue, setSelectedDataCountValue] = useState<number>(1);
  const [dataCount, setDataCount] = useState<number | null>(null);
  const [unitOfValue, setUnitOfValue] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(600);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let titleRef = useRef<HTMLInputElement | null>(null);
  let unitOfValueRef = useRef<HTMLInputElement | null>(null);
  let dataNameRef = useRef<HTMLInputElement | null>(null);
  let secondDataNameRef = useRef<HTMLInputElement | null>(null);

  const handleDataCountSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDataCount(selectedDataCountValue)
  }

  const handleValueSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!labelInput.trim()) return;
    setValues({...values, [labelInput.trim()]: numberInput});

    setLabelInput('');
    setNumberInput(0);
    if (dataNameRef.current && dataNameRef.current.value.trim() != '') {
      setDataName(dataNameRef.current.value.trim());
    }

    if (dataCount === 2) {
      setSecondValues({...secondValues, [labelInput.trim()]: secondNumberInput});
      setSecondNumberInput(0);
    }
    if (secondDataNameRef.current && secondDataNameRef.current.value.trim() != '') {
      setSecondDataName(secondDataNameRef.current.value.trim());
    }
  }

  const handleTitleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (titleRef.current && titleRef.current.value.trim() != '') {
      setTitle(titleRef.current.value.trim())
    }
  }

  const handleLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelInput(e.target.value);
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (e.target.id === 'firstNumber') {
      setNumberInput(isNaN(value) ? 0 : value);
    } else {
      setSecondNumberInput(isNaN(value) ? 0 : value);
    }
  }

  const handleUnitSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (unitOfValueRef.current && unitOfValueRef.current.value.trim() != '') {
      setUnitOfValue(unitOfValueRef.current.value.trim())
    }
  }

  // FIXME::グラフの大きさは、classNameではなく、canvasのwidth, heightに設定されており、そのサイズに合わせてPDFが作成されるので、データのテーブルが小さくなってしまう。
  const pdhDownloadHandler = () => {
    const target = document.getElementById('pdf-target');
    if (target == null) return;
    html2canvas(target, {
      width: target.clientWidth,
      // html2canvas のウィンドウ幅を変更する
      windowWidth: target.clientWidth,
      // キャプチャ長さを変更する
      height: target.clientHeight
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/svg', 1.0);
      console.log(imgData);
      let pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdfWidth * (canvas.height / canvas.width);
      pdf.addImage(imgData, 'SVG', 0, 0, pdfWidth, pdfHeight);
      title != 'タイトル未登録' ? pdf.save(`${title}.pdf`) : pdf.save(`chart.pdf`);
    });
  }

  return (
    <main className='relative w-screen'>
      {screenWidth < 600 && (
        <>
          <div className='absolute inset-0 flex items-center justify-center h-screen w-screen bg-black opacity-40 z-10'></div>
          <p className='absolute inset-0 flex items-center justify-center h-screen w-screen text-white text-xl z-30'>スマートフォンは横向きで使用してください</p>
        </>
      )}
      <div className='flex'>
        <div className='p-2 space-y-2 w-2/3' id='pdf-target'>
          {style === 1 && <BarChart values={values} title={title} dataName={dataName} dataCount={dataCount} secondValues={secondValues} secondDataName={secondDataName} />}
          {style === 2 && <LineChart values={values} title={title} dataName={dataName} dataCount={dataCount} secondValues={secondValues} secondDataName={secondDataName}/>}
          <div className='flex space-x-1'>
            {Object.keys(values).length > 0 &&
              <div className='border-gray-200 border p-5 w-1/2'>
                {dataName != ''}<p>{dataName}</p>
                {Object.entries(values).map(([key, value], index) => (
                    <div
                      className={`flex w-full border-gray-300 ${index == Object.entries(values).length - 1 ? 'border'  : 'border-x border-t'}`}
                      key={index}
                    >
                      <p className='border-gray-300 w-3/5 border-r px-1 overflow-hidden overflow-ellipsis'>{key}</p>
                      <p className='text-right px-1 w-2/5'>{value} {unitOfValue}</p>
                    </div>
                  ))
                }
              </div>
            }
            {Object.keys(secondValues).length > 0 &&
              <div className='border-gray-200 border p-5 w-1/2'>
                {secondDataName != ''}<p>{secondDataName}</p>
                {Object.entries(secondValues).map(([key, value], index) => (
                    <div
                      className={`flex w-full border-gray-300 ${index == Object.entries(secondValues).length - 1 ? 'border'  : 'border-x border-t'}`}
                      key={index}
                    >
                      <p className='border-gray-300 w-3/5 border-r px-1 overflow-hidden overflow-ellipsis'>{key}</p>
                      <p className='text-right px-1 w-2/5'>{value} {unitOfValue}</p>
                    </div>
                  ))
                }
              </div>
            }
          </div>
        </div>
        <div className='p-2 space-y-3 w-1/3 border-l'>
          {title == 'タイトル未登録' ? (
            <div>
              <p className='text-sm font-bold mb-1'>タイトル</p>
              <form onSubmit={handleTitleSubmit}>
                <div className='flex justify-between'>
                  <input ref={titleRef} type='text' className='border-gray-300 border px-1 outline-none w-5/6 block' required />
                  <button type='submit' className='border-gray-300 border px-2 ml-2 w-1/6'>登録</button>
                </div>
              </form>
            </div>
            ) : (
              <dl className='mb-2'>
                <dd className='text-sm font-bold'>タイトル</dd>
                <dt>{title}</dt>
              </dl>
            )
          }
          <div className='flex space-x-1'>
            <div className='w-1/2'>
              <p className='text-sm font-bold mb-1'>スタイル</p>
              <span className='flex'>
                <button className={`border w-5 text-center ${style == 1 ? 'bg-gray-300' : ''}`} value='1' onClick={(e) => setStyle(parseInt((e.target as HTMLButtonElement).value, 10))}>1</button>
                <button className={`border w-5 text-center ${style == 2 ? 'bg-gray-300' : ''}`} value='2' onClick={(e) => setStyle(parseInt((e.target as HTMLButtonElement).value, 10))}>2</button>
              </span>
            </div>
            {unitOfValue == null ? (
              <div className='w-1/2'>
                <p className='text-sm font-bold mb-1'>値の単位</p>
                <form onSubmit={handleUnitSubmit}>
                  <div className='flex justify-between'>
                    <input ref={unitOfValueRef} type='text' className='border-gray-300 border px-1 outline-none w-2/3 block' required />
                    <button type='submit' className='border-gray-300 border px-2 ml-2 w-1/3'>登録</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className='w-1/2'>
                <dd className='text-sm font-bold mb-1'>値の単位</dd>
                <dt>{unitOfValue}</dt>
              </div>
            )}
          </div>
          <div>
            <p className='text-sm font-bold mb-1'>値</p>
            {dataCount === null && (
              <div>
                <p className='text-sm'>データ数</p>
                <form　onSubmit={handleDataCountSubmit}>
                  <fieldset className='flex'>
                    <div className='flex'>
                      {[1, 2].map((value: number) => (
                        <div className='flex' key={value}>
                          <input
                            type='radio'
                            value={value}
                            id={value.toString()}
                            name='dataCount'
                            className='border-gray-300 border text-right outline-none block'
                            defaultChecked={value === 1}
                            onChange={(e) => setSelectedDataCountValue(parseInt(e.target.value))}
                          />
                          <label htmlFor={value.toString()} className='mx-2'>{value}</label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                  <span className='flex justify-center mt-2'>
                    <button type='submit' className='border-gray-300 border px-2 w-full text-center'>データ数登録</button>
                  </span>
                </form>
              </div>
            )}
            { dataCount === 1 && (
              <form onSubmit={handleValueSubmit}>
                <div className='mb-2'>
                  {dataName === '' ? (
                    <input className='border-gray-300 border px-1 outline-none text-sm w-1/2' type='text' placeholder='データ名' ref={dataNameRef}/>
                  ) : (
                    <p className='text-sm'>{dataName}</p>
                  )}
                  <input type='number' step='0.1' id='firstNumber' className='border-gray-300 border text-right outline-none block w-1/2' value={numberInput} onChange={handleNumberInputChange} />
                </div>
                <div className='mb-2'>
                  <input type='text' className='border-gray-300 border px-1 outline-none w-full block' value={labelInput} onChange={handleLabelInputChange} placeholder='ラベル名' required />
                </div>
                <span className='flex justify-center mt-2'>
                  <button type='submit' className='border-gray-300 border px-2 w-full text-center'>値追加</button>
                </span>
              </form>
            )}
            { dataCount === 2 && (
              <form onSubmit={handleValueSubmit}>
                <div className='mb-2'>
                  <span className='flex'>
                    {dataName === '' ? (
                      <input className='border-gray-300 border px-1 outline-none text-sm w-1/2' type='text' placeholder='データ名' ref={dataNameRef}/>
                    ) : (
                      <p className='text-sm w-1/2'>{dataName}</p>
                    )}
                    {secondDataName === '' ? (
                      <input className='border-gray-300 border px-1 outline-none text-sm w-1/2' type='text' placeholder='データ名' ref={secondDataNameRef}/>
                    ) : (
                      <p className='text-sm w-1/2'>{secondDataName}</p>
                    )}
                  </span>
                  <span className='flex'>
                    <input type='number' step='0.1' id='firstNumber' className='border-gray-300 border text-right outline-none block w-1/2' value={numberInput} onChange={handleNumberInputChange} />
                    <input type='number' step='0.1' id='secondNumber' className='border-gray-300 border text-right outline-none block w-1/2' value={secondNumberInput} onChange={handleNumberInputChange} />
                  </span>
                </div>
                <div className='mb-2'>
                  <input type='text' className='border-gray-300 border px-1 outline-none w-full block' value={labelInput} onChange={handleLabelInputChange} placeholder='ラベル名' required />
                </div>
                <span className='flex justify-center mt-2'>
                  <button type='submit' className='border-gray-300 border px-2 w-full text-center'>値追加</button>
                </span>
              </form>
            )}
          </div>
          <button type='button' onClick={pdhDownloadHandler} className='border p-2'>
            PDFファイルをダウンロード
          </button>
        </div>
      </div>
    </main>
  )
}
