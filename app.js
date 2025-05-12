
const loginBtn = document.getElementById('loginBtn');
const guildList = document.getElementById('guildList');
const filtersDiv = document.getElementById('filters');
const confirmLeaveBtn = document.getElementById('confirmLeave');
let userGuilds = [];

loginBtn.onclick = () => {
  window.location.href = "/.netlify/functions/auth-discord";
};

async function fetchGuilds() {
  const res = await fetch("/.netlify/functions/get-guilds");
  userGuilds = await res.json();
  showGuilds(userGuilds);
  filtersDiv.style.display = 'block';
  confirmLeaveBtn.style.display = 'inline-block';
}

function showGuilds(guilds) {
  guildList.innerHTML = '';
  guilds.forEach(g => {
    const div = document.createElement('div');
    div.className = 'guild-card';
    div.innerHTML = `
      <label>
        <input type="checkbox" value="${g.id}" class="guild-checkbox"> 
        <strong>${g.name}</strong> - ${g.memberCount} members
      </label>
    `;
    guildList.appendChild(div);
  });
}

document.getElementById('applyFilters').onclick = () => {
  const min = parseInt(document.getElementById('minMembers').value) || 0;
  const max = parseInt(document.getElementById('maxMembers').value) || Infinity;
  const joinedAfter = new Date(document.getElementById('joinedAfter').value);
  const filtered = userGuilds.filter(g => {
    return g.memberCount >= min && g.memberCount <= max &&
      (!isNaN(joinedAfter.getTime()) ? new Date(g.joinedAt) > joinedAfter : true);
  });
  showGuilds(filtered);
};

confirmLeaveBtn.onclick = async () => {
  const selected = [...document.querySelectorAll('.guild-checkbox:checked')].map(cb => cb.value);
  if (!confirm(`Are you sure you want to leave ${selected.length} servers?`)) return;
  const res = await fetch("/.netlify/functions/leave-guilds", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guildIds: selected })
  });
  const result = await res.json();
  alert(result.message);
  fetchGuilds();
};

window.onload = fetchGuilds;
