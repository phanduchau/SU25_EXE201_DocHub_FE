import { Doctor } from '../types';

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'BS. Trần Đức Anh',
    specialty: 'Khoa Thần kinh',
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '17:00' }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '17:00' }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { start: '09:00', end: '12:00' }
        ]
      }
    ],
    hospital: 'Bệnh viện Đa khoa Quốc tế',
    experience: 10,
    consultationFee: 500000,
    education: ['Đại học Y Hà Nội', 'Chuyên khoa 1 Thần kinh'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    about: 'Bác sĩ Trần Đức Anh có hơn 10 năm kinh nghiệm trong lĩnh vực thần kinh, chuyên điều trị các bệnh về đau đầu, mất ngủ và các rối loạn thần kinh khác.'
  },
  {
    id: '2',
    name: 'BS. Lê Hoàng Việt',
    specialty: 'Khoa nhi',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    availability: [
      {
        day: 'Tuesday',
        slots: [
          { start: '08:00', end: '12:00' },
          { start: '13:00', end: '16:00' }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { start: '08:00', end: '12:00' },
          { start: '13:00', end: '16:00' }
        ]
      },
      {
        day: 'Saturday',
        slots: [
          { start: '08:00', end: '12:00' }
        ]
      }
    ],
    hospital: 'Bệnh viện Nhi đồng 2',
    experience: 8,
    consultationFee: 450000,
    education: ['Đại học Y dược TP.HCM', 'Chuyên khoa 1 Nhi'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    about: 'Bác sĩ Lê Hoàng Việt chuyên khám và điều trị các bệnh lý nhi khoa thông thường và một số bệnh lý chuyên sâu về hô hấp ở trẻ em.'
  },
  {
    id: '3',
    name: 'BS. Bùi Thanh Hoàng',
    specialty: 'Khoa da liễu',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '14:00', end: '18:00' }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { start: '14:00', end: '18:00' }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { start: '14:00', end: '18:00' }
        ]
      }
    ],
    hospital: 'Bệnh viện Da liễu Trung ương',
    experience: 12,
    consultationFee: 600000,
    education: ['Đại học Y Hà Nội', 'Chuyên khoa 2 Da liễu'],
    languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Pháp'],
    about: 'Bác sĩ Bùi Thanh Hoàng là chuyên gia trong lĩnh vực da liễu với hơn 12 năm kinh nghiệm, đặc biệt trong điều trị mụn trứng cá, viêm da và các bệnh lý da khác.'
  },
  {
    id: '4',
    name: 'BS. Lê Quang Vinh',
    specialty: 'Khoa thần kinh',
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    availability: [
      {
        day: 'Tuesday',
        slots: [
          { start: '09:00', end: '12:00' },
          { start: '15:00', end: '19:00' }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { start: '09:00', end: '12:00' },
          { start: '15:00', end: '19:00' }
        ]
      },
      {
        day: 'Saturday',
        slots: [
          { start: '09:00', end: '15:00' }
        ]
      }
    ],
    hospital: 'Bệnh viện Bạch Mai',
    experience: 15,
    consultationFee: 700000,
    education: ['Đại học Y Hà Nội', 'Tiến sĩ Y học - Chuyên ngành Thần kinh'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    about: 'Bác sĩ Lê Quang Vinh là chuyên gia đầu ngành trong lĩnh vực thần kinh, có nhiều năm nghiên cứu và điều trị các bệnh lý thần kinh phức tạp như động kinh, đột quỵ và các rối loạn thần kinh tự miễn.'
  },
  {
    id: '5',
    name: 'BS. Nguyễn Thị Tuyết',
    specialty: 'Khoa nội',
    image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '08:00', end: '16:00' }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { start: '08:00', end: '16:00' }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { start: '08:00', end: '12:00' }
        ]
      }
    ],
    hospital: 'Bệnh viện Đại học Y Hà Nội',
    experience: 9,
    consultationFee: 500000,
    education: ['Đại học Y Hà Nội', 'Thạc sĩ Y học nội khoa'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    about: 'Bác sĩ Nguyễn Thị Tuyết chuyên điều trị các bệnh lý nội khoa, đặc biệt là các bệnh về tim mạch, huyết áp và rối loạn chuyển hóa.'
  },
  {
    id: '6',
    name: 'BS. Bùi Lan Thanh',
    specialty: 'Khoa sản',
    image: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    availability: [
      {
        day: 'Tuesday',
        slots: [
          { start: '08:00', end: '12:00' },
          { start: '14:00', end: '17:00' }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { start: '08:00', end: '12:00' },
          { start: '14:00', end: '17:00' }
        ]
      },
      {
        day: 'Saturday',
        slots: [
          { start: '08:00', end: '12:00' }
        ]
      }
    ],
    hospital: 'Bệnh viện Phụ sản Trung ương',
    experience: 11,
    consultationFee: 550000,
    education: ['Đại học Y Hà Nội', 'Chuyên khoa 2 Sản phụ khoa'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    about: 'Bác sĩ Bùi Lan Thanh có hơn 11 năm kinh nghiệm trong lĩnh vực sản phụ khoa, chuyên điều trị các bệnh lý phụ khoa, theo dõi thai kỳ và đỡ đẻ.'
  },
  {
    id: '7',
    name: 'BS. Trần Khương Trung',
    specialty: 'Khoa ngoại',
    image: 'https://images.pexels.com/photos/6129500/pexels-photo-6129500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '10:00', end: '14:00' }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { start: '10:00', end: '14:00' }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { start: '10:00', end: '14:00' }
        ]
      }
    ],
    hospital: 'Bệnh viện Việt Đức',
    experience: 14,
    consultationFee: 650000,
    education: ['Đại học Y Hà Nội', 'Tiến sĩ Y học - Chuyên ngành Ngoại'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    about: 'Bác sĩ Trần Khương Trung là chuyên gia phẫu thuật với hơn 14 năm kinh nghiệm, chuyên về phẫu thuật tiêu hóa, gan mật và phẫu thuật nội soi.'
  },
  {
    id: '8',
    name: 'BS. Lê Quang Vĩnh',
    specialty: 'Khoa mắt',
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    availability: [
      {
        day: 'Tuesday',
        slots: [
          { start: '08:00', end: '12:00' },
          { start: '14:00', end: '16:00' }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { start: '08:00', end: '12:00' },
          { start: '14:00', end: '16:00' }
        ]
      },
      {
        day: 'Saturday',
        slots: [
          { start: '08:00', end: '12:00' }
        ]
      }
    ],
    hospital: 'Bệnh viện Mắt Trung ương',
    experience: 13,
    consultationFee: 600000,
    education: ['Đại học Y Hà Nội', 'Chuyên khoa 2 Nhãn khoa'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    about: 'Bác sĩ Lê Quang Vĩnh chuyên điều trị các bệnh lý về mắt như đục thủy tinh thể, glôcôm, và các rối loạn thị giác khác, có nhiều kinh nghiệm trong phẫu thuật laser mắt.'
  }
];

export const specialties = [
  { id: '1', name: 'Nội tổng quát', icon: 'stethoscope' },
  { id: '2', name: 'Nhi khoa', icon: 'baby' },
  { id: '3', name: 'Thần kinh', icon: 'brain' },
  { id: '4', name: 'Tai mũi họng', icon: 'ear' },
  { id: '5', name: 'Da liễu', icon: 'microscope' },
  { id: '6', name: 'Mắt', icon: 'eye' },
  { id: '7', name: 'Ngoại', icon: 'scissors' },
  { id: '8', name: 'Tim mạch', icon: 'heart' },
  { id: '9', name: 'Sản phụ khoa', icon: 'baby' },
  { id: '10', name: 'Cơ xương khớp', icon: 'bone' },
  { id: '11', name: 'Tiêu hóa', icon: 'pill' },
  { id: '12', name: 'Răng hàm mặt', icon: 'teeth' }
];