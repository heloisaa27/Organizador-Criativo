import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'

import './styles/components/card.css'
import './styles/components/button.css'
import './styles/components/modal.css'
import './styles/components/form.css'
import './styles/components/tags.css'
import './styles/components/tabs.css'
import './styles/components/header.css'
import './styles/components/section-status.css'

import './styles/features/aesthetic.css'
import './styles/features/characters.css'
import './styles/features/chapter.css'
import './styles/features/timeline.css'
import './styles/features/relationships.css'



createRoot(document.getElementById('root')).render(
    <App />
)
