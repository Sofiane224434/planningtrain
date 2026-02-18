import { useState } from "react";

function Planning() {
    // État pour la date actuelle du calendrier
    const [currentDate, setCurrentDate] = useState(new Date());
    
    // État pour les événements (données mock)
    const [events, setEvents] = useState([
        { 
            id: 1, 
            title: 'Réunion équipe', 
            date: '2026-02-20', 
            description: 'Réunion hebdomadaire avec l\'équipe', 
            color: 'bg-blue-500' 
        },
        { 
            id: 2, 
            title: 'Formation JavaScript', 
            date: '2026-02-22', 
            description: 'Session de formation avancée', 
            color: 'bg-green-500' 
        },
        { 
            id: 3, 
            title: 'Livraison projet', 
            date: '2026-02-25', 
            description: 'Deadline importante du projet', 
            color: 'bg-red-500' 
        },
        { 
            id: 4, 
            title: 'Entretien client', 
            date: '2026-02-18', 
            description: 'Présentation des nouveaux features', 
            color: 'bg-purple-500' 
        }
    ]);
    
    // État pour le modal
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        color: 'bg-blue-500'
    });

    // Couleurs disponibles pour les événements
    const colors = [
        { name: 'Bleu', value: 'bg-blue-500' },
        { name: 'Vert', value: 'bg-green-500' },
        { name: 'Rouge', value: 'bg-red-500' },
        { name: 'Jaune', value: 'bg-yellow-500' },
        { name: 'Violet', value: 'bg-purple-500' },
        { name: 'Rose', value: 'bg-pink-500' }
    ];

    // Fonctions utilitaires pour le calendrier
    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfWeekOfMonth(month, year) {
        const day = new Date(year, month, 1).getDay();
        // Convertir dimanche (0) en 7 pour avoir lundi = 1, dimanche = 7
        return day === 0 ? 7 : day;
    }

    function generateGrid() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = getDaysInMonth(month, year);
        const firstDayOfWeek = getFirstDayOfWeekOfMonth(month, year);
        const grid = [];
        let day = 1;
        
        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 1; j <= 7; j++) {
                if (i === 0 && j < firstDayOfWeek) {
                    week.push(null);
                } else if (day > daysInMonth) {
                    week.push(null);
                } else {
                    week.push(day);
                    day++;
                }
            }
            grid.push(week);
            // Arrêter si on a dépassé tous les jours du mois
            if (day > daysInMonth) break;
        }
        return grid;
    }

    // Fonction pour obtenir les événements d'un jour spécifique
    function getEventsForDay(day) {
        if (!day) return [];
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => event.date === dateStr);
    }

    // Vérifier si c'est aujourd'hui
    function isToday(day) {
        if (!day) return false;
        const today = new Date();
        return day === today.getDate() && 
               currentDate.getMonth() === today.getMonth() && 
               currentDate.getFullYear() === today.getFullYear();
    }

    // Navigation du calendrier
    function goToPreviousMonth() {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }

    function goToNextMonth() {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }

    function goToToday() {
        setCurrentDate(new Date());
    }

    // Fonctions CRUD pour les événements
    function handleCreateEvent() {
        setEditingEvent(null);
        setFormData({
            title: '',
            date: formatDateForInput(currentDate),
            description: '',
            color: 'bg-blue-500'
        });
        setShowModal(true);
    }

    function handleEditEvent(event) {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            date: event.date,
            description: event.description,
            color: event.color
        });
        setShowModal(true);
    }

    function handleDeleteEvent(eventId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            setEvents(events.filter(e => e.id !== eventId));
        }
    }

    function handleSaveEvent(e) {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            alert('Le titre est obligatoire');
            return;
        }

        if (editingEvent) {
            // Modifier un événement existant
            setEvents(events.map(event => 
                event.id === editingEvent.id 
                    ? { ...event, ...formData }
                    : event
            ));
        } else {
            // Créer un nouvel événement
            const newEvent = {
                id: Date.now(),
                ...formData
            };
            setEvents([...events, newEvent]);
        }
        
        setShowModal(false);
    }

    function handleDayClick(day) {
        if (!day) return;
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        setEditingEvent(null);
        setFormData({
            title: '',
            date: dateStr,
            description: '',
            color: 'bg-blue-500'
        });
        setShowModal(true);
    }

    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Obtenir le nom du mois en français
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const grid = generateGrid();

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            {/* En-tête avec navigation */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h1>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={goToPreviousMonth}
                            className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            ← Précédent
                        </button>
                        <button 
                            onClick={goToToday}
                            className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Aujourd'hui
                        </button>
                        <button 
                            onClick={goToNextMonth}
                            className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Suivant →
                        </button>
                        <button 
                            onClick={handleCreateEvent}
                            className="btn-primary px-6 py-2 rounded"
                        >
                            + Nouvel événement
                        </button>
                    </div>
                </div>
            </div>

            {/* Grille du calendrier */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* En-têtes des jours */}
                <div className="grid grid-cols-7 bg-gray-100 border-b">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                        <div key={day} className="p-4 text-center font-semibold text-gray-700">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grille des jours */}
                <div className="grid grid-cols-7">
                    {grid.map((week, weekIndex) => (
                        week.map((day, dayIndex) => {
                            const dayEvents = getEventsForDay(day);
                            const isTodayDate = isToday(day);
                            
                            return (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    onClick={() => handleDayClick(day)}
                                    className={`
                                        min-h-[120px] p-2 border border-gray-200
                                        ${day ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'}
                                        ${isTodayDate ? 'bg-blue-50' : ''}
                                    `}
                                >
                                    {day && (
                                        <>
                                            <div className={`
                                                text-sm font-semibold mb-1
                                                ${isTodayDate ? 'text-blue-600' : 'text-gray-700'}
                                            `}>
                                                {day}
                                                {isTodayDate && (
                                                    <span className="ml-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                                        Aujourd'hui
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Événements du jour */}
                                            <div className="space-y-1">
                                                {dayEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditEvent(event);
                                                        }}
                                                        className={`
                                                            ${event.color} text-white text-xs p-1 rounded
                                                            cursor-pointer hover:opacity-80 truncate
                                                        `}
                                                        title={event.title}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>

            {/* Modal pour créer/modifier un événement */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
                        </h2>
                        
                        <form onSubmit={handleSaveEvent}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Titre *
                                </label>
                                <input
                                    type="text"
                                    className="form-input w-full"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    className="form-input w-full"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="form-input w-full"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Couleur
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {colors.map(color => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: color.value })}
                                            className={`
                                                ${color.value} text-white p-3 rounded text-sm font-semibold
                                                ${formData.color === color.value ? 'ring-4 ring-gray-400' : ''}
                                                hover:opacity-90
                                            `}
                                        >
                                            {color.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {editingEvent && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleDeleteEvent(editingEvent.id);
                                            setShowModal(false);
                                        }}
                                        className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    >
                                        Supprimer
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded flex-1"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary px-6 py-2 rounded flex-1"
                                >
                                    {editingEvent ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Planning;