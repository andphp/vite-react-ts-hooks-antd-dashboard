import React from 'react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const MyLayout = lazy(() => import('@/pages/Layout'))
const NoMatch = lazy(() => import('@/pages/NoMatch'))
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))

function App() {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Suspense fallback={null}>
            <MyLayout />
          </Suspense>
        }
      >
        <Route index element={<Navigate to='/home' />} />
        <Route
          path='home'
          element={
            <Suspense fallback={null}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path='about'
          element={
            <Suspense fallback={null}>
              <About />
            </Suspense>
          }
        />
      </Route>
      <Route
        path='*'
        element={
          <Suspense fallback={null}>
            <NoMatch />
          </Suspense>
        }
      />
    </Routes>
  )
}

export default App
