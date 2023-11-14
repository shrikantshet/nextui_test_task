"use client";
import {Checkbox} from "@nextui-org/react";
import {useEffect, useState} from "react";

const DisplayComponent = ({index, letters}: { index: number; letters: string[] }) => {
  return (
    <div className={"w-[240px] h-[240px] border-1 relative"}>
      {letters.length > 0 ? letters.join("") : "Errored"}
      <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>Index: {index}</div>
    </div>
  );
}

export default function Home() {
  const [checkedComponents, setCheckedComponents] = useState<number[]>(Array.from({length: 7}).map((_, i) => i))
  const [letters, setLetters] = useState<string[][]>(Array.from({length: 7}).map((_) => []))

  const fetchLetter = async (index: number) => {
    const response = await fetch(`https://navirego-interview-mc3narrsb-volodymyr-matselyukh.vercel.app/api/letters/${index}`);
    const responseData = await response.json();
    if(responseData.letter){
      return responseData.letter
    }
    return null
  }

  useEffect(() => {
    (async () => {
      const fetchingPromises = Array.from({length: 7}).map((_, i) => fetchLetter(i));
      const newLetters = await Promise.all(fetchingPromises);
      setLetters(prev => {
        const lettersToUpdate = JSON.parse(JSON.stringify(prev));
        lettersToUpdate.map((currentArray:string[], index:number) => {
          if(newLetters[index]){
            lettersToUpdate[index] = currentArray.length > 0 ? [...currentArray, newLetters[index]] : [newLetters[index]]
          }
        })
        return lettersToUpdate
      })
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
        return <div className={"w-[240px] h-[240px] border-1 bg-red-200"} key={i}>{i} Not rendered</div>
      })}
      </div>
    </main>
  )
}
