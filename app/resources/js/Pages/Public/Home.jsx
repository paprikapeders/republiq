import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { PublicNavbar } from '@/Components/Public/PublicNavbar';
import { PublicSchedules } from '@/Components/Public/PublicSchedules';
import { PublicTeams } from '@/Components/Public/PublicTeams';

export default function Home({ auth, games, teams, seasons }) {
    const [currentPage, setCurrentPage] = useState('schedules');

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Head title="Queens Ballers Republiq" />
            <div className="min-h-screen bg-[#0f0f1e]">
                <PublicNavbar 
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                />
                
                {currentPage === 'schedules' && (
                    <PublicSchedules games={games} teams={teams} seasons={seasons} />
                )}
                
                {currentPage === 'teams' && (
                    <PublicTeams teams={teams} seasons={seasons} />
                )}
            </div>
        </>
    );
}