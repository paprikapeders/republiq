<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team-League Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto py-8 px-4">
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold mb-6">Team-League Management</h1>
            
            <!-- Add Team to League -->
            <div class="bg-green-50 p-4 rounded-lg mb-6">
                <h2 class="text-lg font-semibold mb-4">Add Team to League</h2>
                <form id="addTeamForm">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Team</label>
                            <select name="team_id" class="w-full p-2 border rounded-lg">
                                <option value="">Select Team</option>
                                @foreach($teams as $team)
                                    <option value="{{ $team->id }}">{{ $team->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">League</label>
                            <select name="league_id" class="w-full p-2 border rounded-lg">
                                <option value="">Select League</option>
                                @foreach($leagues as $league)
                                    <option value="{{ $league->id }}">{{ $league->name }} ({{ $league->year }})</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                Add Team to League
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            <!-- Current Team-League Relationships -->
            <div class="bg-white">
                <h2 class="text-lg font-semibold mb-4">Current Relationships</h2>
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="border border-gray-300 px-4 py-2 text-left">Team</th>
                                <th class="border border-gray-300 px-4 py-2 text-left">Coach</th>
                                <th class="border border-gray-300 px-4 py-2 text-left">Leagues</th>
                                <th class="border border-gray-300 px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($teams as $team)
                                <tr>
                                    <td class="border border-gray-300 px-4 py-2">{{ $team->name }}</td>
                                    <td class="border border-gray-300 px-4 py-2">{{ $team->coach->name ?? 'No Coach' }}</td>
                                    <td class="border border-gray-300 px-4 py-2">
                                        @if($team->leagues->count() > 0)
                                            @foreach($team->leagues as $league)
                                                <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-1 mb-1">
                                                    {{ $league->name }} ({{ $league->year }})
                                                </span>
                                            @endforeach
                                        @else
                                            <span class="text-gray-500">No leagues</span>
                                        @endif
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2">
                                        @foreach($team->leagues as $league)
                                            <button onclick="removeTeamFromLeague({{ $team->id }}, {{ $league->id }})" 
                                                    class="bg-red-500 text-white px-2 py-1 rounded text-xs mr-1 mb-1 hover:bg-red-600">
                                                Remove from {{ $league->name }}
                                            </button>
                                        @endforeach
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script>
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        // Add team to league
        document.getElementById('addTeamForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('{{ route("team-leagues.add") }}', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred');
            });
        });
        
        // Remove team from league
        function removeTeamFromLeague(teamId, leagueId) {
            if (!confirm('Are you sure you want to remove this team from the league?')) {
                return;
            }
            
            const formData = new FormData();
            formData.append('team_id', teamId);
            formData.append('league_id', leagueId);
            
            fetch('{{ route("team-leagues.remove") }}', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred');
            });
        }
    </script>
</body>
</html>