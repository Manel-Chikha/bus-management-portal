// Configuration de base
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
if (!API_URL) {
  console.error("ERREUR: REACT_APP_API_URL n'est pas définie");
  throw new Error("Configuration manquante - Vérifiez votre fichier .env");
}
// Headers d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Retourner des headers vides plutôt que de lancer une erreur
    return { 'Content-Type': 'application/json' };
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchProducers = async () => {
  try {
    const response = await fetch(`${API_URL}/api/producers`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Force logout if token is invalid
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching producers:", error);
    throw error;
  }
};
export const fetchProfiles = async () => {
  try {
    console.log("[DEBUG] Tentative de récupération des profils...");
    const response = await fetch(`${API_URL}/api/profiles`, {
      headers: getAuthHeaders()
    });

    console.log("[DEBUG] Réponse du serveur:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[DEBUG] Erreur détaillée:", errorData);
      throw new Error(errorData.message || 'Erreur lors du chargement des profils');
    }

    return await response.json();
  } catch (error) {
    console.error("[DEBUG] Erreur complète:", error);
    throw error;
  }
};

export const addProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/profiles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du profil');
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};
export const fetchWeekPresences = async (year, weekNumber) => {
  try {
    const response = await fetch(`${API_URL}/api/presences/week/${year}/${weekNumber}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Erreur lors du chargement des présences de la semaine")
    return await response.json()
  } catch (error) {
    console.error("Erreur:", error)
    throw error
  }
}
export const fetchPresencesByWeekString = async (weekString) => {
  try {
    const response = await fetch(`${API_URL}/api/presences/week/${weekString}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Erreur lors du chargement des présences de la semaine")
    return await response.json()
  } catch (error) {
    console.error("Erreur:", error)
    throw error
  }
}
export const fetchPresencesByDateRange = async (startDate, endDate) => {
  try {
    const response = await fetch(`${API_URL}/api/presences/dateRange?startDate=${startDate}&endDate=${endDate}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Erreur lors du chargement des présences")
    return await response.json()
  } catch (error) {
    console.error("Erreur:", error)
    throw error
  }
}

export const updateProfile = async (id, profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/profiles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du profil');
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const deleteProfile = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/profiles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du profil');
    }
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const fetchProfileById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors du chargement du profil');
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const updateProfileSegment = async (id, segment) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${id}/segment`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ segment })
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du segment');
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

// ========== AUTH ==========

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Email ou mot de passe incorrect');
    }

    const data = await response.json();

    // Stocker le token et les informations utilisateur
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      if (data.role) localStorage.setItem('userRole', data.role);
      if (data.segment) localStorage.setItem('userSegment', data.segment);
    }

    return data;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userSegment');
};

// ========== EMPLOYÉS ==========

export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}/api/employees`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des employés');
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};
// Fonction pour exporter les données des employés
export const exportEmployeesData = async (format, periodType, period, segment = null, employeesData = null) => {
  try {
    let url = `${API_URL}/api/employees/export?format=${format}&periodType=${periodType}&period=${encodeURIComponent(period)}`;

    if (segment) {
      url += `&segment=${encodeURIComponent(segment)}`;
    }

    const options = {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    };

    // Ajoutez le corps seulement si employeesData existe
    if (employeesData) {
      options.body = JSON.stringify(employeesData);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de l\'export');
    }

    return await response.blob();
  } catch (error) {
    console.error("Erreur détaillée d'export:", error);
    throw new Error(`Échec de l'export: ${error.message}`);
  }
};
// Fonction pour exporter les données d'un employé spécifique
export const exportEmployeeData = async (employeeId, format, period) => {
  try {
    const response = await fetch(
      `${API_URL}/api/employees/${employeeId}/export?format=${format}&period=${period}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export');
    }

    return await response.blob();
  } catch (error) {
    console.error("Erreur d'export:", error);
    throw error;
  }
};
export const fetchEmployeesBySegment = async (segment) => {
  try {
    // Vérifiez que segment est bien une string
    if (typeof segment !== 'string') {
      console.error('Segment should be a string, got:', segment);
      throw new Error('Invalid segment parameter');
    }

    const response = await fetch(`${API_URL}/api/employees/segment/${encodeURIComponent(segment)}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des employés par segment');
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await fetch(`${API_URL}/api/employees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Ne pas logger les conflits NFC (409)
      if (response.status !== 409) {
        console.error('API Error:', errorData);
      }
      return { error: true, ...errorData };
    }
    return await response.json();
  } catch (error) {
    console.error('Network Error:', error);
    return { error: true, message: error.message };
  }
};
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await fetch(`${API_URL}/api/employees/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(employeeData)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        type: data.error || 'UNKNOWN_ERROR',
        message: data.message || 'Erreur lors de la mise à jour'
      };
    }

    return data;
  } catch (error) {
    return {
      error: true,
      message: 'Erreur réseau'
    };
  }
};


export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/employees/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'employé');
    return true;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

// ========== NFC ==========

export const fetchScans = async () => {
  try {
    const response = await fetch(`${API_URL}/api/nfc/scans`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des scans');
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const validateNfc = async (nfcToken) => {
  try {
    const response = await fetch(`${API_URL}/api/nfc/validate/${nfcToken}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors de la validation du token NFC');
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

// ========== SEGMENTS ==========

export const fetchSegments = async () => {
  try {
    const response = await fetch(`${API_URL}/api/segments`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des segments');
    const data = await response.json();
    return Array.isArray(data) ? data : data.segments || [];
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const addSegment = async (segmentName) => {
  try {
    const response = await fetch(`${API_URL}/api/segments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: segmentName }) // Assurez-vous que c'est le bon format attendu par le backend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'ajout du segment');
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};
export const deleteSegment = async (segmentName) => {
  try {
    const response = await fetch(`${API_URL}/api/segments/${encodeURIComponent(segmentName)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la suppression du segment');
    }

    return true;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};

// ========== PRÉSENCES ==========

export const fetchPresences = async (date) => {
  try {
    const response = await fetch(`${API_URL}/api/presences/date/${date}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des présences');
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const fetchEmployeePresences = async (employeeId) => {
  try {
    const response = await fetch(`${API_URL}/api/presences/employee/${employeeId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des présences');
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

// ========== ÉTAT DE L'API ==========

export const checkApiStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/api/nfc/test`);
    return response.ok;
  } catch (error) {
    console.error("Erreur:", error);
    return false;
  }
};

// ========== REQUÊTE GÉNÉRIQUE ==========

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const config = {
    method,
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : null
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur API');
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur API (${endpoint}):`, error);
    throw error;
  }
};
 export const fetchEmployeesWithManagers = async () => {
    const response = await fetch(`${API_URL}/api/employees/with-managers`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des employés');
    return await response.json();
  };

export const fetchEmployeesWithLeaders = async () => {
  try {
    const response = await fetch(`${API_URL}/api/employees/with-leaders`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des employés avec chefs');
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};
// Fonctions pour les producteurs
export const addProducer = async (producerData) => {
  try {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Vous devez être connecté pour ajouter un chef de segment');
    }

    // Vérifier si l'utilisateur est un admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ADMIN') {
      throw new Error('Seuls les administrateurs peuvent ajouter des chefs des segments ');
    }

    // S'assurer que les données requises sont présentes
    const requiredFields = ['name', 'email', 'password', 'matricule', 'segment'];
    const missingFields = requiredFields.filter(field => !producerData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
    }

    const response = await fetch(`${API_URL}/api/users/producers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...producerData,
        role: 'PRODUCER'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur lors de l\'ajout du chef de segment' }));
      throw new Error(errorData.message || 'Erreur lors de l\'ajout du chef de segment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur détaillée:", error);
    throw error;
  }
};

export const updateProducer = async (id, producerData) => {
  try {
    const response = await fetch(`${API_URL}/api/producers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(producerData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la mise à jour du chef de segment');
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const deleteProducer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/producers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la suppression du chef de segment');
    }

    return true;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

// Supprimez l'export par défaut anonyme si présent
// export default { ... };

// Remplacez l'export anonyme par un export nommé
const api = {
  login,
  logout,
  fetchEmployees,
  fetchEmployeesBySegment,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  fetchScans,
  validateNfc,
  fetchSegments,
  addSegment,
  fetchProfiles,
  fetchProfileById,
  addProfile,
  updateProfile,
  updateProfileSegment,
  deleteProfile,
  fetchPresences,
  fetchEmployeePresences,
  checkApiStatus,
  apiRequest,
  addProducer,
  updateProducer,
  deleteProducer
};

export default api;