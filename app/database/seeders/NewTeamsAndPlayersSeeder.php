<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Team;
use App\Models\Player;
use App\Models\League;
use Illuminate\Support\Facades\Hash;

class NewTeamsAndPlayersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Default password for all players
        $defaultPassword = 'demo123';
        
        // Get the QBRL Season 2 league (created by BasketballLeagueSeeder)
        $qbrlLeague = League::where('name', 'QBRL Season 2')->first();
        
        if (!$qbrlLeague) {
            $this->command->error('QBRL Season 2 league not found. Please run BasketballLeagueSeeder first.');
            return;
        }
        

        
        // Teams and players data
        $teamsData = [
            [
                'name' => 'Stars',
                'code' => 'STARS',
                'leagues' => [$qbrlLeague->id], // QBRL Season 2
                'coach' => [
                    'name' => 'Coach Stars',
                    'email' => 'coach.stars@pbl.com',
                    'phone' => '+63 912 001 0001',
                ],
                'players' => [
                    ['name' => 'Juan Perez', 'email' => 'juan.perez@pbl.com', 'phone' => '+63 912 001 0101', 'jersey_number' => 1, 'position' => 'Guard'],
                    ['name' => 'Jacob Green', 'email' => 'jacob.green@pbl.com', 'phone' => '+63 912 001 0102', 'jersey_number' => 30, 'position' => 'Forward'],
                    ['name' => 'Danny Leon', 'email' => 'danny.leon@pbl.com', 'phone' => '+63 912 001 0103', 'jersey_number' => 11, 'position' => 'Guard'],
                    ['name' => 'Keanu (KJ)', 'email' => 'keanu.kj@pbl.com', 'phone' => '+63 912 001 0104', 'jersey_number' => 13, 'position' => 'Forward'],
                    ['name' => 'Lou Bautista', 'email' => 'lou.bautista@pbl.com', 'phone' => '+63 912 001 0105', 'jersey_number' => 15, 'position' => 'Center'],
                    ['name' => 'Manny', 'email' => 'manny@pbl.com', 'phone' => '+63 912 001 0106', 'jersey_number' => 17, 'position' => 'Forward'],
                    ['name' => 'Fernando Rossis', 'email' => 'fernando.rossis@pbl.com', 'phone' => '+63 912 001 0107', 'jersey_number' => null, 'position' => 'Player'],
                    ['name' => 'Nick', 'email' => 'nick@pbl.com', 'phone' => '+63 912 001 0108', 'jersey_number' => 21, 'position' => 'Guard'],
                    ['name' => 'Francis', 'email' => 'francis@pbl.com', 'phone' => '+63 912 001 0109', 'jersey_number' => 24, 'position' => 'Forward'],
                    ['name' => 'GUY', 'email' => 'guy@pbl.com', 'phone' => '+63 912 001 0110', 'jersey_number' => 81, 'position' => 'Player'],
                    ['name' => 'RJ', 'email' => 'rj@pbl.com', 'phone' => '+63 912 001 0111', 'jersey_number' => 32, 'position' => 'Forward'],
                    ['name' => 'Torres', 'email' => 'torres@pbl.com', 'phone' => '+63 912 001 0112', 'jersey_number' => 8, 'position' => 'Guard'],
                ]
            ],
            [
                'name' => 'Bwood',
                'code' => 'BWOOD',
                'leagues' => [$qbrlLeague->id],
                'coach' => [
                    'name' => 'Coach Bwood',
                    'email' => 'coach.bwood@pbl.com',
                    'phone' => '+63 912 002 0001',
                ],
                'players' => [
                    ['name' => 'Ryu Primero', 'email' => 'ryu.primero@pbl.com', 'phone' => '+63 912 002 0101', 'jersey_number' => 4, 'position' => 'Guard'],
                    ['name' => 'Michael Jay Cutamora', 'email' => 'michael.cutamora@pbl.com', 'phone' => '+63 912 002 0102', 'jersey_number' => 3, 'position' => 'Guard'],
                    ['name' => 'Justin Yu', 'email' => 'justin.yu@pbl.com', 'phone' => '+63 912 002 0103', 'jersey_number' => 6, 'position' => 'Forward'],
                    ['name' => 'Harvey Palapar', 'email' => 'harvey.palapar@pbl.com', 'phone' => '+63 912 002 0104', 'jersey_number' => 8, 'position' => 'Guard'],
                    ['name' => 'Phil Quinanola', 'email' => 'phil.quinanola@pbl.com', 'phone' => '+63 912 002 0105', 'jersey_number' => 9, 'position' => 'Forward'],
                    ['name' => 'Jerrick Taasan', 'email' => 'jerrick.taasan@pbl.com', 'phone' => '+63 912 002 0106', 'jersey_number' => 10, 'position' => 'Guard'],
                    ['name' => 'Carlo Gaw', 'email' => 'carlo.gaw@pbl.com', 'phone' => '+63 912 002 0107', 'jersey_number' => 11, 'position' => 'Forward'],
                    ['name' => 'James Abapo', 'email' => 'james.abapo@pbl.com', 'phone' => '+63 912 002 0108', 'jersey_number' => 15, 'position' => 'Center'],
                    ['name' => 'Mitch Antigua', 'email' => 'mitch.antigua@pbl.com', 'phone' => '+63 912 002 0109', 'jersey_number' => 20, 'position' => 'Forward'],
                    ['name' => 'Roque Fernandez', 'email' => 'roque.fernandez@pbl.com', 'phone' => '+63 912 002 0110', 'jersey_number' => 21, 'position' => 'Guard'],
                    ['name' => 'AJ De Leon', 'email' => 'aj.deleon@pbl.com', 'phone' => '+63 912 002 0111', 'jersey_number' => 22, 'position' => 'Forward'],
                    ['name' => 'Jomarie Pampilo', 'email' => 'jomarie.pampilo@pbl.com', 'phone' => '+63 912 002 0112', 'jersey_number' => 24, 'position' => 'Guard'],
                    ['name' => 'TJ Mirasol', 'email' => 'tj.mirasol@pbl.com', 'phone' => '+63 912 002 0113', 'jersey_number' => 24, 'position' => 'Forward'],
                    ['name' => 'Anfernee Paredes', 'email' => 'anfernee.paredes@pbl.com', 'phone' => '+63 912 002 0114', 'jersey_number' => 27, 'position' => 'Forward'],
                ]
            ],
            [
                'name' => 'SDA',
                'code' => 'SDA',
                'leagues' => [$qbrlLeague->id],
                'coach' => [
                    'name' => 'Coach SDA',
                    'email' => 'coach.sda@pbl.com',
                    'phone' => '+63 912 003 0001',
                ],
                'players' => [
                    ['name' => 'Moad', 'email' => 'moad@pbl.com', 'phone' => '+63 912 003 0101', 'jersey_number' => 0, 'position' => 'Guard'],
                    ['name' => 'Jake J', 'email' => 'jake.j@pbl.com', 'phone' => '+63 912 003 0102', 'jersey_number' => 4, 'position' => 'Guard'],
                    ['name' => 'Renz Meneses', 'email' => 'renz.meneses@pbl.com', 'phone' => '+63 912 003 0103', 'jersey_number' => 26, 'position' => 'Forward'],
                    ['name' => 'Christian Barana', 'email' => 'christian.barana@pbl.com', 'phone' => '+63 912 003 0104', 'jersey_number' => 12, 'position' => 'Guard'],
                    ['name' => 'Kiel', 'email' => 'kiel@pbl.com', 'phone' => '+63 912 003 0105', 'jersey_number' => 7, 'position' => 'Guard'],
                    ['name' => 'Epi Cardenas', 'email' => 'epi.cardenas@pbl.com', 'phone' => '+63 912 003 0106', 'jersey_number' => 10, 'position' => 'Forward'],
                    ['name' => 'Adrian Dotado', 'email' => 'adrian.dotado@pbl.com', 'phone' => '+63 912 003 0107', 'jersey_number' => 13, 'position' => 'Forward'],
                    ['name' => 'Zhander', 'email' => 'zhander@pbl.com', 'phone' => '+63 912 003 0108', 'jersey_number' => 22, 'position' => 'Center'],
                    ['name' => 'Nico Meneses', 'email' => 'nico.meneses@pbl.com', 'phone' => '+63 912 003 0109', 'jersey_number' => 25, 'position' => 'Forward'],
                    ['name' => 'JB', 'email' => 'jb@pbl.com', 'phone' => '+63 912 003 0110', 'jersey_number' => 25, 'position' => 'Forward'],
                    ['name' => 'Xhio', 'email' => 'xhio@pbl.com', 'phone' => '+63 912 003 0111', 'jersey_number' => null, 'position' => 'Player'],
                    ['name' => 'Paul Lim', 'email' => 'paul.lim@pbl.com', 'phone' => '+63 912 003 0112', 'jersey_number' => null, 'position' => 'Player'],
                ]
            ],
            [
                'name' => 'Underrated',
                'code' => 'UNDER',
                'leagues' => [$qbrlLeague->id],
                'coach' => [
                    'name' => 'Coach Underrated',
                    'email' => 'coach.underrated@pbl.com',
                    'phone' => '+63 912 004 0001',
                ],
                'players' => [
                    ['name' => 'Julian Deveras', 'email' => 'julian.deveras@pbl.com', 'phone' => '+63 912 004 0101', 'jersey_number' => 0, 'position' => 'Guard'],
                    ['name' => 'Reeyn Padua', 'email' => 'reeyn.padua@pbl.com', 'phone' => '+63 912 004 0102', 'jersey_number' => 3, 'position' => 'Guard'],
                    ['name' => 'Renzo', 'email' => 'renzo@pbl.com', 'phone' => '+63 912 004 0103', 'jersey_number' => 5, 'position' => 'Forward'],
                    ['name' => 'Ching', 'email' => 'ching@pbl.com', 'phone' => '+63 912 004 0104', 'jersey_number' => 7, 'position' => 'Guard'],
                    ['name' => 'Julian B', 'email' => 'julian.b@pbl.com', 'phone' => '+63 912 004 0105', 'jersey_number' => 8, 'position' => 'Guard'],
                    ['name' => 'Adriane Reyes', 'email' => 'adriane.reyes@pbl.com', 'phone' => '+63 912 004 0106', 'jersey_number' => 10, 'position' => 'Forward'],
                    ['name' => 'Zid', 'email' => 'zid@pbl.com', 'phone' => '+63 912 004 0107', 'jersey_number' => 11, 'position' => 'Forward'],
                    ['name' => 'Zipagan', 'email' => 'zipagan@pbl.com', 'phone' => '+63 912 004 0108', 'jersey_number' => 14, 'position' => 'Center'],
                    ['name' => 'Alur', 'email' => 'alur@pbl.com', 'phone' => '+63 912 004 0109', 'jersey_number' => 15, 'position' => 'Forward'],
                    ['name' => 'Marquez', 'email' => 'marquez@pbl.com', 'phone' => '+63 912 004 0110', 'jersey_number' => 16, 'position' => 'Forward'],
                    ['name' => 'Leonard', 'email' => 'leonard@pbl.com', 'phone' => '+63 912 004 0111', 'jersey_number' => 18, 'position' => 'Center'],
                    ['name' => 'Ronniez', 'email' => 'ronniez@pbl.com', 'phone' => '+63 912 004 0112', 'jersey_number' => 23, 'position' => 'Forward'],
                    ['name' => 'Sean', 'email' => 'sean@pbl.com', 'phone' => '+63 912 004 0113', 'jersey_number' => 24, 'position' => 'Guard'],
                ]
            ],
            [
                'name' => 'D\'Engineers\' Pride',
                'code' => 'DENGR',
                'leagues' => [$qbrlLeague->id],
                'coach' => [
                    'name' => 'Coach D\'Engineers\' Pride',
                    'email' => 'coach.dengineers@pbl.com',
                    'phone' => '+63 912 005 0001',
                ],
                'players' => [
                    ['name' => 'Sam David', 'email' => 'sam.david@pbl.com', 'phone' => '+63 912 005 0101', 'jersey_number' => 3, 'position' => 'Guard'],
                    ['name' => 'Aaron Paul David', 'email' => 'aaron.david@pbl.com', 'phone' => '+63 912 005 0102', 'jersey_number' => 9, 'position' => 'Guard'],
                    ['name' => 'Andre Londono', 'email' => 'andre.londono@pbl.com', 'phone' => '+63 912 005 0103', 'jersey_number' => 11, 'position' => 'Forward'],
                    ['name' => 'Armando Caguete', 'email' => 'armando.caguete@pbl.com', 'phone' => '+63 912 005 0104', 'jersey_number' => 14, 'position' => 'Center'],
                    ['name' => 'John Pulido', 'email' => 'john.pulido@pbl.com', 'phone' => '+63 912 005 0105', 'jersey_number' => 16, 'position' => 'Forward'],
                    ['name' => 'Matala', 'email' => 'matala@pbl.com', 'phone' => '+63 912 005 0106', 'jersey_number' => 18, 'position' => 'Center'],
                    ['name' => 'Blands Garcia', 'email' => 'blands.garcia@pbl.com', 'phone' => '+63 912 005 0107', 'jersey_number' => 21, 'position' => 'Guard'],
                    ['name' => 'Rhon Gonzales', 'email' => 'rhon.gonzales@pbl.com', 'phone' => '+63 912 005 0108', 'jersey_number' => 22, 'position' => 'Forward'],
                    ['name' => 'Mikoy Carrasco', 'email' => 'mikoy.carrasco@pbl.com', 'phone' => '+63 912 005 0109', 'jersey_number' => 29, 'position' => 'Forward'],
                    ['name' => 'Omar', 'email' => 'omar@pbl.com', 'phone' => '+63 912 005 0110', 'jersey_number' => 27, 'position' => 'Forward'],
                    ['name' => 'Larry', 'email' => 'larry@pbl.com', 'phone' => '+63 912 005 0111', 'jersey_number' => 26, 'position' => 'Forward'],
                ]
            ],
            [
                'name' => 'Yaya Agency',
                'code' => 'YAYA',
                'leagues' => [$qbrlLeague->id],
                'coach' => [
                    'name' => 'Coach Yaya Agency',
                    'email' => 'coach.yaya@pbl.com',
                    'phone' => '+63 912 006 0001',
                ],
                'players' => [
                    ['name' => 'Jmarty', 'email' => 'jmarty@pbl.com', 'phone' => '+63 912 006 0101', 'jersey_number' => 7, 'position' => 'Guard'],
                    ['name' => 'Renzo Jimeno', 'email' => 'renzo.jimeno@pbl.com', 'phone' => '+63 912 006 0102', 'jersey_number' => 1, 'position' => 'Guard'],
                    ['name' => 'Justin Ycaro', 'email' => 'justin.ycaro@pbl.com', 'phone' => '+63 912 006 0103', 'jersey_number' => 12, 'position' => 'Forward'],
                    ['name' => 'Matals', 'email' => 'matals@pbl.com', 'phone' => '+63 912 006 0104', 'jersey_number' => 6, 'position' => 'Forward'],
                    ['name' => 'Archie', 'email' => 'archie@pbl.com', 'phone' => '+63 912 006 0105', 'jersey_number' => 8, 'position' => 'Guard'],
                    ['name' => 'Rcris Pasquito', 'email' => 'rcris.pasquito@pbl.com', 'phone' => '+63 912 006 0106', 'jersey_number' => 13, 'position' => 'Forward'],
                    ['name' => 'Jeloy Malinab', 'email' => 'jeloy.malinab@pbl.com', 'phone' => '+63 912 006 0107', 'jersey_number' => 14, 'position' => 'Center'],
                    ['name' => 'Patrick Arellano', 'email' => 'patrick.arellano@pbl.com', 'phone' => '+63 912 006 0108', 'jersey_number' => 17, 'position' => 'Forward'],
                    ['name' => 'Joe', 'email' => 'joe@pbl.com', 'phone' => '+63 912 006 0109', 'jersey_number' => 20, 'position' => 'Forward'],
                    ['name' => 'Eduance', 'email' => 'eduance@pbl.com', 'phone' => '+63 912 006 0110', 'jersey_number' => 22, 'position' => 'Guard'],
                    ['name' => 'Roi Villarta', 'email' => 'roi.villarta@pbl.com', 'phone' => '+63 912 006 0111', 'jersey_number' => 25, 'position' => 'Forward'],
                    ['name' => 'Kidd Melendez', 'email' => 'kidd.melendez@pbl.com', 'phone' => '+63 912 006 0112', 'jersey_number' => 28, 'position' => 'Center'],
                    ['name' => 'Jojo', 'email' => 'jojo@pbl.com', 'phone' => '+63 912 006 0113', 'jersey_number' => null, 'position' => 'Player'],
                ]
            ],
            [
                'name' => 'Elmhurst',
                'code' => 'ELMHST',
                'leagues' => [$qbrlLeague->id],
                'coach' => [
                    'name' => 'Coach Elmhurst',
                    'email' => 'coach.elmhurst@pbl.com',
                    'phone' => '+63 912 007 0001',
                ],
                'players' => [
                    ['name' => 'Jonas', 'email' => 'jonas@pbl.com', 'phone' => '+63 912 007 0101', 'jersey_number' => 0, 'position' => 'Guard'],
                    ['name' => 'DJ', 'email' => 'dj@pbl.com', 'phone' => '+63 912 007 0102', 'jersey_number' => 1, 'position' => 'Guard'],
                    ['name' => 'Migs', 'email' => 'migs@pbl.com', 'phone' => '+63 912 007 0103', 'jersey_number' => 3, 'position' => 'Guard'],
                    ['name' => 'Luke', 'email' => 'luke@pbl.com', 'phone' => '+63 912 007 0104', 'jersey_number' => 4, 'position' => 'Forward'],
                    ['name' => 'Peter', 'email' => 'peter@pbl.com', 'phone' => '+63 912 007 0105', 'jersey_number' => 8, 'position' => 'Guard'],
                    ['name' => 'Ryan', 'email' => 'ryan@pbl.com', 'phone' => '+63 912 007 0106', 'jersey_number' => 10, 'position' => 'Forward'],
                    ['name' => 'Jayonne', 'email' => 'jayonne@pbl.com', 'phone' => '+63 912 007 0107', 'jersey_number' => 11, 'position' => 'Forward'],
                    ['name' => 'Richard', 'email' => 'richard@pbl.com', 'phone' => '+63 912 007 0108', 'jersey_number' => 19, 'position' => 'Center'],
                    ['name' => 'Fonso', 'email' => 'fonso@pbl.com', 'phone' => '+63 912 007 0109', 'jersey_number' => 404, 'position' => 'Player'],
                    ['name' => 'Arielle', 'email' => 'arielle@pbl.com', 'phone' => '+63 912 007 0110', 'jersey_number' => 15, 'position' => 'Forward'],
                ]
            ],
            [
                'name' => 'UnspdxState',
                'code' => 'UNSPD',
                'leagues' => [$qbrlLeague->id],
                'coach' => [
                    'name' => 'Coach UnspdxState',
                    'email' => 'coach.unspdxstate@pbl.com',
                    'phone' => '+63 912 008 0001',
                ],
                'players' => [
                    ['name' => 'Christian Vinluan', 'email' => 'christian.vinluan@pbl.com', 'phone' => '+63 912 008 0101', 'jersey_number' => 1, 'position' => 'Guard'],
                    ['name' => 'Renzo Tampoc', 'email' => 'renzo.tampoc@pbl.com', 'phone' => '+63 912 008 0102', 'jersey_number' => 2, 'position' => 'Guard'],
                    ['name' => 'Adrien Imson', 'email' => 'adrien.imson@pbl.com', 'phone' => '+63 912 008 0103', 'jersey_number' => 5, 'position' => 'Forward'],
                    ['name' => 'Angelo Vinluan', 'email' => 'angelo.vinluan@pbl.com', 'phone' => '+63 912 008 0104', 'jersey_number' => 11, 'position' => 'Forward'],
                    ['name' => 'Regie Villariez', 'email' => 'regie.villariez@pbl.com', 'phone' => '+63 912 008 0105', 'jersey_number' => 15, 'position' => 'Center'],
                    ['name' => 'Andrew Esteves', 'email' => 'andrew.esteves@pbl.com', 'phone' => '+63 912 008 0106', 'jersey_number' => 16, 'position' => 'Forward'],
                    ['name' => 'Bryan Coquia', 'email' => 'bryan.coquia@pbl.com', 'phone' => '+63 912 008 0107', 'jersey_number' => 21, 'position' => 'Guard'],
                    ['name' => 'Justin Gaviola', 'email' => 'justin.gaviola@pbl.com', 'phone' => '+63 912 008 0108', 'jersey_number' => 24, 'position' => 'Forward'],
                    ['name' => 'Sean Naybe', 'email' => 'sean.naybe@pbl.com', 'phone' => '+63 912 008 0109', 'jersey_number' => 27, 'position' => 'Forward'],
                    ['name' => 'Chio', 'email' => 'chio@pbl.com', 'phone' => '+63 912 008 0110', 'jersey_number' => 3, 'position' => 'Guard'],
                    ['name' => 'Franz Abuda', 'email' => 'franz.abuda@pbl.com', 'phone' => '+63 912 008 0111', 'jersey_number' => 77, 'position' => 'Center'],
                    ['name' => 'Ken Carreon', 'email' => 'ken.carreon@pbl.com', 'phone' => '+63 912 008 0112', 'jersey_number' => 17, 'position' => 'Forward'],
                    ['name' => 'Patrick Remudo', 'email' => 'patrick.remudo@pbl.com', 'phone' => '+63 912 008 0113', 'jersey_number' => 44, 'position' => 'Center'],
                ]
            ],
            [
                'name' => 'NY Classick',
                'code' => 'NYC',
                'leagues' => [$qbrlLeague->id],
                'coach' => [
                    'name' => 'Coach NY Classick',
                    'email' => 'coach.nyclassick@pbl.com',
                    'phone' => '+63 912 009 0001',
                ],
                'players' => [
                    ['name' => 'PJ Pigoy', 'email' => 'pj.pigoy@pbl.com', 'phone' => '+63 912 009 0101', 'jersey_number' => 4, 'position' => 'Guard'],
                    ['name' => 'C. Abrio', 'email' => 'c.abrio@pbl.com', 'phone' => '+63 912 009 0102', 'jersey_number' => 7, 'position' => 'Guard'],
                    ['name' => 'Leron', 'email' => 'leron@pbl.com', 'phone' => '+63 912 009 0103', 'jersey_number' => 6, 'position' => 'Forward'],
                    ['name' => 'Romar', 'email' => 'romar@pbl.com', 'phone' => '+63 912 009 0104', 'jersey_number' => 2, 'position' => 'Guard'],
                    ['name' => 'Baagi', 'email' => 'baagi@pbl.com', 'phone' => '+63 912 009 0105', 'jersey_number' => 8, 'position' => 'Forward'],
                    ['name' => 'Uno', 'email' => 'uno@pbl.com', 'phone' => '+63 912 009 0106', 'jersey_number' => 1, 'position' => 'Guard'],
                    ['name' => 'Bernard', 'email' => 'bernard@pbl.com', 'phone' => '+63 912 009 0107', 'jersey_number' => 3, 'position' => 'Forward'],
                    ['name' => 'Miggy', 'email' => 'miggy@pbl.com', 'phone' => '+63 912 009 0108', 'jersey_number' => 2, 'position' => 'Guard'],
                ]
            ],
        ];
        
        foreach ($teamsData as $teamData) {
            // Create or get coach user
            $coachUser = User::firstOrCreate(
                ['email' => $teamData['coach']['email']],
                [
                    'name' => $teamData['coach']['name'],
                    'password' => Hash::make($defaultPassword),
                    'role' => 'coach',
                    'phone' => $teamData['coach']['phone'],
                ]
            );
            
            // Create team
            $team = Team::firstOrCreate(
                ['code' => $teamData['code']],
                [
                    'name' => $teamData['name'],
                    'coach_id' => $coachUser->id,
                ]
            );
            
            // Attach team to QBRL Season 2 league
            foreach ($teamData['leagues'] as $leagueId) {
                $team->leagues()->syncWithoutDetaching([$leagueId]);
            }
            
            // Create players
            foreach ($teamData['players'] as $playerData) {
                // Create or get player user
                $playerUser = User::firstOrCreate(
                    ['email' => $playerData['email']],
                    [
                        'name' => $playerData['name'],
                        'password' => Hash::make($defaultPassword),
                        'role' => 'player',
                        'phone' => $playerData['phone'],
                    ]
                );
                
                // Create player record
                Player::firstOrCreate(
                    [
                        'user_id' => $playerUser->id,
                        'team_id' => $team->id
                    ],
                    [
                        'jersey_number' => $playerData['jersey_number'],
                        'position' => $playerData['position'],
                    ]
                );
            }
        }
        
        $this->command->info('New teams and players created successfully!');
        $this->command->info('Default password for all users: ' . $defaultPassword);
    }
}
