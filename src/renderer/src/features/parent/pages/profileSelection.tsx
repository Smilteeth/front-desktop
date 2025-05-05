import { FC } from 'react'
import styles from '../styles/profileSelection.module.css'
import ProfileAvatar from '@renderer/assets/images/profile-icon-9.png'

interface Profile {
    id: number
    name: string
    type: 'padre' | 'hijo'
    avatarImage?: string
}

const ProfileSelection: FC = () => {
    const navigate = (path: string) => {
        //Colocar ruta para home
        console.log(`Navegando a: ${path}`)
    }
  
    const profiles: Profile[] = [
        {
            id: 1,
            name: 'Mi perfil',
            type: 'padre',
        },
        {
            id: 2,
            name: 'Jhon Doe',
            type: 'hijo',
        }
    ]

    const handleProfileSelect = (profile: Profile) => {
        if (profile.type === 'padre') {
            //agregar ruta para home
            navigate('')
        } else {
            //agregar ruta para el chamaco
            console.log('home hijo')
        }
  }

    return (
        <div className={styles.profileSelectionPage}>
        <h1 className={styles.title}>Bienvenido, seleccione el perfil</h1>
        
        <div className={styles.profilesContainer}>
            {profiles.map(profile => (
            <div 
                key={profile.id}
                className={styles.profileCard}
                onClick={() => handleProfileSelect(profile)}
            >
                <div className={styles.avatarContainer}>
                {profile.avatarImage ? (
                    <img 
                    src={profile.avatarImage} 
                    alt={profile.name} 
                    className={styles.avatar}
                    />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                    <img src={ProfileAvatar} alt="Profile" className={styles.profileAvatar} />
                    </div>
                )}
                </div>
                <p className={styles.profileName}>{profile.name}</p>
            </div>
            ))}
        </div>
        </div>
  )
}

export default ProfileSelection