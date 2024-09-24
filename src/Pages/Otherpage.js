import React from 'react'
import Header from '../Component/Header'
import Lefthomepagepart from '../Component/Lefthomepagepart'
import { useParams } from 'react-router-dom'

export default function Otherpage() {
    const {searchparam} = useParams();
  return (
    <>
    <Header/>
    <Lefthomepagepart searchparam={searchparam}/>
    </>
  )
}
