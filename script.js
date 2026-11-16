const input = document.getElementById("markdown-input")
const rawOutput = document.getElementById("html-output")
const preview = document.getElementById("preview")

// Convert Markdown syntax into HTML
function convertMarkdown(){
  let rawCode = input.value

  // Define regular expressions for supported Markdown syntax
  const h1Pattern = /^\s*#(?!#)\s(.+?)$/mg
  const h2Pattern = /^\s*#{2}(?!#)\s(.+?)$/mg
  const h3Pattern = /^\s*#{3}(?!#)\s(.+?)$/mg
  const strongPattern = /(\*\*|__)(.+?)\1/g
  const italicPattern = /((?<!\*)\*(?!\*)|(?<!_)_(?!_))(.+?)\1/g
  const imgPattern = /!\[(.+?)\]\((.+?)\)/g
  const linkPattern = /\[(.+?)\]\((.+?)\)/g
  const quotePattern = /^\s*>\s(.+?)$/mg
  const ulPattern = /(^-\s(.+?)$\n?)+/mg
  const olPattern = /(^\d+\.\s(.+?)$\n?)+/mg
  const inlinecodePattern = /`(.+?)`/g 
  
  // Store inline code snippets and generate unique placeholders
  let codeIndex = 0
  const codeSnippet = (rawCode.match(inlinecodePattern) || [])
  const Placeholder = codeSnippet.map((m,i)=>`CodePlaceholder${i}`)

  // Temporarily replace inline code to prevent other Markdown patterns from modifying it
  rawCode = rawCode.replace(inlinecodePattern,(match)=>{
    codeIndex ++
    return Placeholder[codeIndex-1]
  })

  // Convert headings, text formatting, images, links, and blockquotes into HTML
  rawCode = rawCode.replace(h1Pattern,`<h1>$1</h1>` )
  rawCode = rawCode.replace(h2Pattern,`<h2>$1</h2>` )
  rawCode = rawCode.replace(h3Pattern,`<h3>$1</h3>` )
  rawCode = rawCode.replace(strongPattern,`<strong>$2</strong>` )
  rawCode = rawCode.replace(italicPattern,`<em>$2</em>` )
  rawCode = rawCode.replace(imgPattern,`<img alt="$1" src="$2">`)
  rawCode = rawCode.replace(linkPattern,`<a href="$2">$1</a>`)
  rawCode = rawCode.replace(quotePattern,`<blockquote>$1</blockquote>`)

  // Convert unordered list items into HTML list elements
  rawCode = rawCode.replace(ulPattern, (match)=>{
    const lists =  match.split("\n").filter((list)=>list.trim() !== "").map((m)=>`<li>${m.replace(/^-/,"").trim()}</li>`).join("\n")
    return `<ul>${lists}</ul>`
  })

   // Convert ordered list items into HTML list elements
  rawCode = rawCode.replace(olPattern,(match)=>{
    const lists = match.split("\n").filter((list)=> list.trim() !== "").map((m)=> `<li>${(m.replace(/^\d+\./, "")).trim()}</li>`).join("\n")
    return `<ol>${lists}</ol>`
  })

   // Restore inline code snippets and wrap them in code elements
  Placeholder.forEach((holder,index)=>{
    rawCode = rawCode.replace(holder,`<code>${codeSnippet[index].slice(1,-1)}</code>`)
  })
      
  return rawCode

}

// Update the raw HTML output and live preview whenever the input changes
input.addEventListener("input", ()=>{
  const converted = convertMarkdown()
  rawOutput.textContent = converted
  preview.innerHTML =  converted
})
