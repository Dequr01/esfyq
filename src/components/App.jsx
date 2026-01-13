import StackedSectionsContainer from './StackedSectionsContainer'
import Hero from './Hero'
import About from './About'
import Projects from './Projects'
import Contact from './Contact'

export default function App() {
  return (
    <StackedSectionsContainer>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </StackedSectionsContainer>
  )
}
