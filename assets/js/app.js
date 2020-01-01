import '../css/app.scss'
import 'phoenix_html'

// Flash
document.querySelectorAll('.flash-container > div').forEach(f => f.querySelector('.close').addEventListener('click', f.remove.bind(f)))
