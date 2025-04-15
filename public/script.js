// 🌗 Theme toggle logic — placed OUTSIDE the analyzeBtn handler
document.getElementById('themeToggle').addEventListener('change', function () {
  document.body.classList.toggle('light');
});

// 🔍 Code review button logic
document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const code = document.getElementById('codeInput').value;
  const lang = document.getElementById('language').value;
  const level = document.getElementById('eli5').value;

  if (!code.trim()) {
    alert("Please paste some code.");
    return;
  }

  // Show loading spinner or message
  document.getElementById('responseArea').innerHTML =
    '<span class="loader">⏳ Reviewing your code...</span>';

  try {
    const response = await fetch('/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, lang, level })
    });

    const data = await response.json();
    document.getElementById('responseArea').textContent = data.output || 'No response.';
  } catch (error) {
    document.getElementById('responseArea').innerHTML =
      `❌ Something went wrong.<br><code>${error.message}</code>`;
    console.error(error);
  }
});
