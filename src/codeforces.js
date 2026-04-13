const MIN_RATING = 800;
const MAX_RATING = 1600;

async function getRandomProblem({ minRating = MIN_RATING, maxRating = MAX_RATING } = {}) {
  const response = await fetch('https://codeforces.com/api/problemset.problems');

  if (!response.ok) {
    throw new Error(`Codeforces API error: ${response.status}`);
  }

  const { status, result } = await response.json();

  if (status !== 'OK') {
    throw new Error('Codeforces API returned non-OK status');
  }

  const filtered = result.problems.filter(
    (p) => p.rating >= minRating && p.rating <= maxRating
  );

  if (filtered.length === 0) {
    throw new Error(`Nenhum problema encontrado na faixa ${minRating}–${maxRating}`);
  }

  // "Math.random()" -> entre 0 e 1 // "* filtered.length" -> tam. máx // "Match.floor" -> arredonda para baixo
  const problem = filtered[Math.floor(Math.random() * filtered.length)];

  return {
    name: problem.name,
    rating: problem.rating,
    tags: problem.tags,
    url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
  };
}

module.exports = { getRandomProblem };
