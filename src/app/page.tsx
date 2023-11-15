"use client";
import {Checkbox} from "@nextui-org/react";
import {useEffect, useState} from "react";

const DisplayComponent = ({index, letters}: { index: number; letters: string[] }) => {
  return (
    <div className={`w-[240px] h-[240px] border-1 relative`} style={{
      backgroundColor: `rgb(0,0,0,0.${index})`
    }}>
      <p className={"break-all"}>
        {letters.length > 0 ? letters.join("") : null}
      </p>
      <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>Index: {index} & Current Array Length: {letters.length}</div>
    </div>
  );
}

export default function Home() {
  const [checkedComponents, setCheckedComponents] = useState<number[]>(Array.from({length: 7}).map((_, i) => i))
  const [letters, setLetters] = useState<string[][]>(Array.from({length: 7}).map((_) => []))

  const fetchLetter = async (index: number) => {
    try {
      const response = await fetch(`https://navirego-interview-mc3narrsb-volodymyr-matselyukh.vercel.app/api/letters/${index}`);
      const responseData: { letter?: string, message?: string } = await response.json();
      if (responseData.letter) {
        return responseData.letter
      }
      return null
    } catch (e) {
      console.log('error', e);
      return null
    }
  }

  useEffect(() => {
    const fetchAllLetters = async () => {
      const fetchingPromises = Array.from({length: 7}).map((_, i) => fetchLetter(i));
      const newLetters = await Promise.all(fetchingPromises);
      setLetters(prev => {
        return prev.map((currentArray:string[], index:number) => {
          const newLetterForCurrentIndex = newLetters[index];
          if(newLetterForCurrentIndex){
            // should return new array of max length 30 - so slicing it
            return currentArray.length > 0 ? [...currentArray, newLetterForCurrentIndex].slice(-30) : [newLetterForCurrentIndex]
          }
          return currentArray
        })
      })
    }
    (async () => {
      while (true) {
        await fetchAllLetters();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    })()
  }, []);

  return (
    <main className={"p-2"}>
      <ul className="flex gap-4">
        {Array.from({length: 7}).map((_, i) => (
          <li key={i}>
            <Checkbox
              isSelected={checkedComponents.includes(i)}
              onClick={() => {
                setCheckedComponents(prev => {
                  return prev.includes(i) ? prev.filter(item => item !== i) : [...prev, i]
                })
              }}>
              {i}
            </Checkbox>
          </li>
        ))}
      </ul>
      <div className={"flex flex-wrap"}>
      {Array.from({length: 7}).map((_, i) => {
        if (checkedComponents.includes(i)) {
          return (<DisplayComponent key={i} index={i} letters={letters[i]} />)
        }
        return null
      })}
      </div>
    </main>
  )
}
