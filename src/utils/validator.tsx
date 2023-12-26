export const validator = {
  required: { value: true, message: 'Wajib diisi' },
  isRequired: (value: any) => ({ value: value, message: 'Wajib diisi' }),
  pattern: (pattern: any) => ({ value: pattern, message: `Tidak sesuai format` }),
  bank: {
    value: /^((\+62|62|\d)\d{3}\d+)$/i,
    message: 'Format Nomor Rekening atau Nomor E-Wallet tidak sesuai'
  },
  url: {
    value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,8}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    message: `Format URL tidak sesuai`
  },
  email: {
    value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
    message: `Format email tidak sesuai`
  },
  phone: {
    // international phone number regex
    value: /^((\+\d{2}|0)(\d{2,3}))[ .-]?\d{1,4}[ .-]?\d{2,4}[ .-]?\d{2,4}$/i,
    message: `Format Telp/HP tidak sesuai. Gunakan + Kode negara (contoh: +65) sebagai awal jika nomor luar Indonesia`
  },
  phoneNotStrict: {
    // international phone number regex
    value: /^((\+\d{2}|0|6)(\d{2,3}))[ .-]?\d{1,4}[ .-]?\d{2,4}[ .-]?\d{2,4}$/i,
    message: `Format Telp/HP tidak sesuai. Gunakan Kode negara (contoh: +65) sebagai awal jika nomor luar Indonesia`
  },
  min: (min: number) => ({ value: min, message: `harus minimal bernilai ${min}` }),
  max: (max: number) => ({ value: max, message: `tidak boleh melebihi ${max}` }),
  minLength: (min: number) => ({ value: min, message: `harus berisi minimal ${min} karakter` }),
  maxLength: (max: number) => ({ value: max, message: `tidak boleh melebihi maksimal ${max} karakter` })
};
