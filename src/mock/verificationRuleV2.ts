import type {
  VerificationV2Question,
  VerificationV2QuestionBlock,
  VerificationV2QuestionBlockType,
  VerificationV2QuestionGroupConfig,
  VerificationV2Rule,
  VerificationV2Scenario,
  VerificationV2SpecialScenarioMode,
  VerificationV2SpecialScenario,
  VerificationV2SpecialRules,
} from '../types'

const createQuestion = (
  id: string,
  questionName: string,
): VerificationV2Question => ({
  id,
  questionName,
})

const createGroup = (
  questionIds: string[],
  requiredCorrect = 0,
  askInOrder = true,
): VerificationV2QuestionGroupConfig => ({
  askInOrder,
  questionIds,
  requiredCorrect,
})

const createQuestionBlock = (
  id: string,
  name: string,
  questionIds: string[],
  requiredCorrect: number,
  blockType: VerificationV2QuestionBlockType = 'custom',
): VerificationV2QuestionBlock => ({
  blockType,
  id,
  name,
  questionIds,
  requiredCorrect,
})

const createScenario = (
  id: string,
  name: string,
  questionBlocks: VerificationV2QuestionBlock[],
  isDefault = false,
  patch: Partial<VerificationV2Scenario> = {},
): VerificationV2Scenario => ({
  id,
  isDefault,
  name,
  ...patch,
  questionBlocks,
})

const createSpecialScenario = (
  id: string,
  name: string,
  questionIds: string[],
  requiredCorrect: number,
  mode: VerificationV2SpecialScenarioMode = 'append',
  askInOrder = true,
): VerificationV2SpecialScenario => ({
  askInOrder,
  id,
  mode,
  name,
  questionIds,
  requiredCorrect,
})

const createSpecialRules = (
  patch: Partial<VerificationV2SpecialRules> = {},
): VerificationV2SpecialRules => ({
  organizationOverride: {
    enabled: false,
    firstThreeMustBeAskedFirst: false,
    requiredBySegment: {
      'o1-o3': 3,
      'o4-o5': 5,
    },
    ...patch.organizationOverride,
  },
  scenarios: patch.scenarios ?? [],
})

export const verificationV2QuestionBank: VerificationV2Question[] = [
  createQuestion('q-reg-mother-maiden', 'Nama gadis ibu kandung'),
  createQuestion(
    'q-reg-last-outgoing',
    'Salah satu dari 5 transaksi keluar terakhir',
  ),
  createQuestion('q-reg-echannel', 'Kepemilikan fasilitas E-Channel'),
  createQuestion('q-reg-debit-card-type', 'Jenis kartu debit'),
  createQuestion('q-reg-account-type', 'Jenis Rekening'),
  createQuestion('q-reg-origin-branch', 'Cabang asal rekening'),
  createQuestion('q-reg-email', 'Alamat Email'),
  createQuestion('q-reg-mobile', 'No HP'),
  createQuestion('q-reg-id-number', 'NIK/Paspor/KITAS'),
  createQuestion('q-reg-address', 'Alamat'),
  createQuestion('q-reg-ktp-name', 'Nama Lengkap sesuai KTP'),
  createQuestion('q-reg-birth-place-date', 'Tempat dan Tanggal lahir'),
  createQuestion(
    'q-card-mother-maiden',
    'Nama gadis ibu kandung (mandatory)',
  ),
  createQuestion(
    'q-card-billing-address',
    'Alamat penagihan: Jika email, tanyakan alamat e-mail; jika kertas, tanyakan alamat pengiriman',
  ),
  createQuestion(
    'q-card-billing-alt',
    'Email/alamat penagihan (yang belum ditanyakan pada poin 2)',
  ),
  createQuestion(
    'q-card-payment-channel',
    'Channel pembayaran terakhir tagihan kartu kredit (mBank, KlikBank, myBank, ATM, Autodebet, cabang)',
  ),
  createQuestion(
    'q-card-supplementary-holder',
    'Nama pemilik kartu tambahan (jika ada)',
  ),
  createQuestion('q-card-combined-limit', 'Limit gabungan kartu kredit'),
  createQuestion('q-card-count', 'Berapa kartu kredit yang dimiliki'),
  createQuestion(
    'q-card-installment',
    'Cicilan kartu kredit atas transaksi apa (jika ada)',
  ),
  createQuestion('q-card-autopay', 'Autopay atas transaksi apa (jika ada)'),
  createQuestion(
    'q-card-payment-date',
    'Tanggal pembayaran tagihan kartu kredit',
  ),
  createQuestion('q-card-last-transaction-where', 'Transaksi terakhir dimana'),
  createQuestion(
    'q-card-number-expiry',
    'Nomor kartu kredit dan expired date',
  ),
  createQuestion(
    'q-card-additional-status',
    'Kartu tambahan (ada/tidak) -> sebutkan nama CH tambahan',
  ),
  createQuestion('q-card-limit', 'Limit kartu kredit'),
  createQuestion('q-card-last-transaction', 'Transaksi terakhir'),
  createQuestion(
    'q-prio-mother-maiden',
    'Nama Gadis Ibu Kandung (wajib)',
  ),
  createQuestion('q-prio-address-ktp', 'Alamat sesuai KTP'),
  createQuestion('q-prio-birth-place-date', 'Tempat & Tanggal Lahir'),
  createQuestion(
    'q-prio-card-branch',
    'Cabang Penerbit Kartu Prioritas',
  ),
  createQuestion('q-prio-card-number', 'Nomor Kartu Prioritas'),
  createQuestion('q-prio-mobile', 'Nomor HP yang terdaftar'),
  createQuestion('q-prio-atm-card-type', 'Jenis Kartu ATM'),
  createQuestion('q-prio-account-type-owned', 'Jenis Rekening yang Dimiliki'),
  createQuestion(
    'q-prio-echannel-owned',
    'Fasilitas e-Channel yang Dimiliki',
  ),
  createQuestion('q-hbb-company-name', 'Nama perusahaan'),
  createQuestion('q-hbb-company-address', 'Alamat perusahaan'),
  createQuestion('q-hbb-company-phone', 'No. telepon'),
  createQuestion('q-hbb-company-email', 'Email perusahaan'),
  createQuestion('q-hbb-company-identity', 'No identitas perusahaan'),
  createQuestion(
    'q-hbb-origin-branch',
    'Cabang asal no. rekening yang disebutkan',
  ),
  createQuestion('q-pb-email', 'email'),
  createQuestion('q-pb-favorite-color', 'Warna Favorit'),
  createQuestion('q-pb-favorite-vacation-city', 'Kota liburan Favorit'),
  createQuestion('q-pb-hobby', 'Hobi'),
  createQuestion('q-shared-kanwil', 'Kanwil'),
  createQuestion('q-pb-nip', 'NIP'),
  createQuestion('q-branch-manager', 'Nama Pimpinan Cabang'),
  createQuestion('q-branch-address', 'Alamat Cabang'),
  createQuestion('q-branch-phone', 'No Telp Cabang'),
  createQuestion('q-branch-code', 'Nama / Kode Cabang'),
  createQuestion(
    'q-kbb-corporate-user-id',
    'Corporate ID dan User ID (mandatory karena digunakan untuk proses penarikan data nasabah)',
  ),
  createQuestion('q-kbb-keybank-serial', 'Serial number KeyBank'),
  createQuestion('q-kbb-user-role', 'Peranan user'),
  createQuestion(
    'q-kbb-pic-email',
    'Alamat email PIC perusahaan yang terdaftar di BO web (User Information)',
  ),
  createQuestion(
    'q-kbb-pic-email-rule',
    'Jika data email PIC KBB ada di menu User Information dan Corporate Information maka yang dianggap lolos verifikasi adalah sesuai data di User Information Efektif tanggal 30 Maret 2023',
  ),
  createQuestion('q-kbb-user-owner-name', 'Nama lengkap pemilik User ID'),
  createQuestion(
    'q-kbb-origin-branch',
    'Cabang asal pengajuan KBB (Jika di BO SME WEB KCU BANYUWANGI tapi PIC verifikasi KCP BANYUWANGI itu dianggap tidak sesuai)',
  ),
  createQuestion('q-kpr-debtor-name', 'Nama debitur'),
  createQuestion('q-kpr-registered-phone', 'NO hp yang terdaftar'),
  createQuestion('q-kpr-registered-email', 'Alamat email terdaftar'),
  createQuestion('q-kpr-loan-term', 'Jangka waktu pinjaman'),
  createQuestion(
    'q-kpr-installment-debit-date',
    'Tanggal perdebetan angsuran',
  ),
  createQuestion('q-kpr-initial-plafond', 'Plafon awal pinjaman'),
  createQuestion('q-kpr-collateral-address', 'Alamat yang diagunkan'),
  createQuestion(
    'q-kpr-debtor-birth-place-date',
    'Tempat tanggal lahir debitur',
  ),
  createQuestion('q-kpr-mother-name', 'Nama ibu kandung'),
  createQuestion('q-pl-ktp-name', 'Nama sesuai KTP'),
  createQuestion('q-pl-echannel', 'Kepemilikan Fas Echannel'),
  createQuestion('q-pl-ktp-number', 'No KTP'),
  createQuestion('q-merchant-name', 'Nama Usaha'),
  createQuestion('q-merchant-address', 'Alamat Usaha'),
  createQuestion(
    'q-merchant-alternative',
    'Alternative : nomer hp pemilik, nama pemilik',
  ),
  createQuestion(
    'q-merchant-owner',
    'Nama Owner (jika ada singkatan di data EMS, maka jika penelpon memberikan yang lebih lengkap, dapat diterima)',
  ),
  createQuestion('q-paylater-phone', 'No telepon/HP'),
  createQuestion(
    'q-paylater-bank-id',
    'Bank ID yang terkoneksi dengan Paylater',
  ),
  createQuestion('q-paylater-email', 'Alamat email nasabah'),
  createQuestion('q-paylater-limit', 'Limit paylater'),
  createQuestion(
    'q-paylater-last-transaction',
    'Nominal transaksi paylater terakhir',
  ),
  createQuestion(
    'q-paylater-last-payment',
    'Nominal pembayaran tagihan paylater terakhir',
  ),
]

const baseVerificationV2Rules: VerificationV2Rule[] = [
  {
    channelCodes: ['PHONE'],
    customerSegments: ['regular'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup(
        [
          'q-reg-last-outgoing',
          'q-reg-echannel',
          'q-reg-debit-card-type',
          'q-reg-account-type',
          'q-reg-origin-branch',
        ],
        2,
      ),
      mandatory: createGroup(['q-reg-mother-maiden'], 1),
      static: createGroup(
        [
          'q-reg-email',
          'q-reg-mobile',
          'q-reg-id-number',
          'q-reg-address',
          'q-reg-ktp-name',
          'q-reg-birth-place-date',
        ],
        2,
      ),
    },
    id: 'v2-phone-perbankan-regular',
    maxWrongAttempts: 3,
    skillQueueCode: 'SQ_GENERAL_ID',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['BANKAPP'],
    customerSegments: ['regular'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup(
        [
          'q-reg-last-outgoing',
          'q-reg-echannel',
          'q-reg-debit-card-type',
          'q-reg-account-type',
          'q-reg-origin-branch',
        ],
        2,
      ),
      mandatory: createGroup(['q-reg-mother-maiden'], 1),
      static: createGroup(
        [
          'q-reg-email',
          'q-reg-mobile',
          'q-reg-id-number',
          'q-reg-address',
          'q-reg-ktp-name',
          'q-reg-birth-place-date',
        ],
        0,
      ),
    },
    id: 'v2-bankapp-perbankan-registered',
    maxWrongAttempts: 3,
    skillQueueCode: 'SQ_GENERAL_ID',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE'],
    customerSegments: ['regular'],
    groups: {
      alternative: createGroup([
        'q-card-supplementary-holder',
        'q-card-combined-limit',
        'q-reg-birth-place-date',
        'q-card-count',
        'q-card-installment',
        'q-card-autopay',
        'q-card-payment-date',
        'q-card-last-transaction-where',
      ]),
      dynamic: createGroup([]),
      mandatory: createGroup(['q-card-mother-maiden'], 1),
      static: createGroup(
        [
          'q-card-billing-address',
          'q-card-billing-alt',
          'q-card-payment-channel',
        ],
        3,
      ),
    },
    id: 'v2-phone-card-regular',
    maxWrongAttempts: 3,
    skillQueueCode: 'SQ_CARD_PRIORITY',
    specialRules: createSpecialRules({
      scenarios: [
        createSpecialScenario(
          'ato-addon',
          'ATO / add-on',
          [
            'q-card-number-expiry',
            'q-card-additional-status',
            'q-card-limit',
            'q-card-last-transaction',
          ],
          4,
        ),
      ],
    }),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['BANKAPP'],
    customerSegments: ['regular'],
    groups: {
      alternative: createGroup([
        'q-card-supplementary-holder',
        'q-card-combined-limit',
        'q-reg-birth-place-date',
        'q-card-count',
        'q-card-installment',
        'q-card-autopay',
        'q-card-payment-date',
        'q-card-last-transaction-where',
      ]),
      dynamic: createGroup([]),
      mandatory: createGroup(['q-card-mother-maiden'], 1),
      static: createGroup(
        [
          'q-card-billing-address',
          'q-card-billing-alt',
          'q-card-payment-channel',
        ],
        2,
      ),
    },
    id: 'v2-bankapp-card-regular',
    maxWrongAttempts: 3,
    skillQueueCode: 'SQ_CARD_PRIORITY',
    specialRules: createSpecialRules({
      scenarios: [
        createSpecialScenario(
          'ato-addon',
          'ATO / add-on',
          [
            'q-card-number-expiry',
            'q-card-additional-status',
            'q-card-limit',
            'q-card-last-transaction',
          ],
          4,
        ),
      ],
    }),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['priority', 'solitaire'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup([]),
      mandatory: createGroup(['q-prio-mother-maiden'], 1),
      static: createGroup(
        [
          'q-prio-address-ktp',
          'q-prio-birth-place-date',
          'q-prio-card-branch',
          'q-prio-card-number',
          'q-prio-mobile',
          'q-prio-atm-card-type',
          'q-prio-account-type-owned',
          'q-prio-echannel-owned',
        ],
        2,
      ),
    },
    id: 'v2-prio-soli-perbankan',
    maxWrongAttempts: 3,
    skillQueueCode: 'SQ_PRIO_SOLI_PERBANKAN',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['priority', 'solitaire'],
    groups: {
      alternative: createGroup([
        'q-card-supplementary-holder',
        'q-card-combined-limit',
        'q-reg-birth-place-date',
        'q-card-count',
        'q-card-installment',
        'q-card-autopay',
        'q-card-payment-date',
        'q-card-last-transaction-where',
      ]),
      dynamic: createGroup([]),
      mandatory: createGroup(['q-card-mother-maiden'], 1),
      static: createGroup(
        [
          'q-card-billing-address',
          'q-card-billing-alt',
          'q-card-payment-channel',
        ],
        3,
      ),
    },
    id: 'v2-prio-soli-card',
    maxWrongAttempts: 3,
    skillQueueCode: 'SQ_PRIO_SOLI_KARTU_KREDIT',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['organization-business'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup([]),
      mandatory: createGroup([]),
      static: createGroup(
        [
          'q-hbb-company-name',
          'q-hbb-company-address',
          'q-hbb-company-phone',
          'q-hbb-company-email',
          'q-hbb-company-identity',
          'q-reg-account-type',
          'q-hbb-origin-branch',
        ],
        5,
      ),
    },
    id: 'v2-hbb-business',
    maxWrongAttempts: 3,
    skillQueueCode: 'SQ_BANK_BISNIS',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['solitaire'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup([]),
      mandatory: createGroup([]),
      static: createGroup(
        [
          'q-pb-email',
          'q-reg-mobile',
          'q-pb-favorite-color',
          'q-pb-favorite-vacation-city',
          'q-pb-hobby',
          'q-shared-kanwil',
          'q-pb-nip',
        ],
        3,
      ),
    },
    id: 'v2-personal-banker-solitaire',
    maxWrongAttempts: null,
    skillQueueCode: 'SQ_PERSONAL_BANKER',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: [
      'regular',
      'priority',
      'solitaire',
      'organization-business',
    ],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup([]),
      mandatory: createGroup([]),
      static: createGroup(
        [
          'q-branch-manager',
          'q-branch-address',
          'q-branch-phone',
          'q-shared-kanwil',
          'q-branch-code',
        ],
        2,
      ),
    },
    id: 'v2-layanan-cabang',
    maxWrongAttempts: null,
    scenarios: [
      createScenario(
        'default',
        'Default',
        [
          createQuestionBlock(
            'branch-data',
            'Branch Data',
            [
              'q-branch-manager',
              'q-branch-address',
              'q-branch-phone',
              'q-shared-kanwil',
              'q-branch-code',
            ],
            2,
          ),
        ],
        true,
        {
          agentHint: 'Please ask the first three questions first.',
        },
      ),
      createScenario(
        'branch-to-other-services',
        'Branch to Other Services',
        [
          createQuestionBlock(
            'branch-data',
            'Branch Data',
            [
              'q-branch-manager',
              'q-branch-address',
              'q-branch-phone',
              'q-shared-kanwil',
              'q-branch-code',
            ],
            3,
          ),
          createQuestionBlock(
            'customer-data',
            'Customer Data',
            [
              'q-reg-email',
              'q-reg-mobile',
              'q-reg-id-number',
              'q-reg-address',
              'q-reg-ktp-name',
              'q-reg-birth-place-date',
            ],
            3,
          ),
        ],
        false,
        {
          agentHint: 'Please ask the first three questions first.',
        },
      ),
    ],
    skillQueueCode: 'SQ_LAYANAN_CABANG',
    specialRules: createSpecialRules({
      scenarios: [
        createSpecialScenario(
          'branch-combined-verification',
          'Branch Combined Verification',
          [
            'q-branch-manager',
            'q-branch-address',
            'q-branch-phone',
            'q-reg-mother-maiden',
            'q-reg-mobile',
            'q-reg-email',
          ],
          6,
          'replace',
        ),
      ],
    }),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['organization-business'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup(
        ['q-kbb-keybank-serial', 'q-kbb-user-role'],
        2,
      ),
      mandatory: createGroup(['q-kbb-corporate-user-id'], 1),
      static: createGroup(
        [
          'q-hbb-company-address',
          'q-kbb-pic-email',
          'q-kbb-pic-email-rule',
          'q-kbb-user-owner-name',
          'q-kbb-origin-branch',
        ],
        0,
      ),
    },
    id: 'v2-kbb-organization',
    maxWrongAttempts: 3,
    scenarios: [
      createScenario(
        'o1-o3',
        'O1-O3',
        [
          createQuestionBlock(
            'mandatory',
            'Mandatory',
            ['q-kbb-corporate-user-id'],
            1,
            'mandatory',
          ),
          createQuestionBlock(
            'dynamic',
            'Dynamic',
            ['q-kbb-keybank-serial', 'q-kbb-user-role'],
            2,
            'dynamic',
          ),
          createQuestionBlock(
            'static',
            'Static',
            [
              'q-hbb-company-address',
              'q-kbb-pic-email',
              'q-kbb-pic-email-rule',
              'q-kbb-user-owner-name',
              'q-kbb-origin-branch',
            ],
            0,
            'static',
          ),
        ],
        true,
        {
          agentHint: 'Please ask questions 1-3 first.',
        },
      ),
      createScenario(
        'o4-o5',
        'O4-O5',
        [
          createQuestionBlock(
            'mandatory',
            'Mandatory',
            ['q-kbb-corporate-user-id'],
            1,
            'mandatory',
          ),
          createQuestionBlock(
            'dynamic',
            'Dynamic',
            ['q-kbb-keybank-serial', 'q-kbb-user-role'],
            2,
            'dynamic',
          ),
          createQuestionBlock(
            'static',
            'Static',
            [
              'q-hbb-company-address',
              'q-kbb-pic-email',
              'q-kbb-pic-email-rule',
              'q-kbb-user-owner-name',
              'q-kbb-origin-branch',
            ],
            2,
            'static',
          ),
        ],
        false,
        {
          agentHint: 'Please ask questions 1-3 first.',
        },
      ),
    ],
    skillQueueCode: 'SQ_DIGITAL_EN',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['regular', 'priority', 'solitaire'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup([]),
      mandatory: createGroup([]),
      static: createGroup(
        [
          'q-kpr-debtor-name',
          'q-kpr-registered-phone',
          'q-kpr-registered-email',
          'q-kpr-loan-term',
          'q-kpr-installment-debit-date',
          'q-kpr-initial-plafond',
          'q-kpr-collateral-address',
          'q-kpr-debtor-birth-place-date',
          'q-kpr-mother-name',
        ],
        5,
      ),
    },
    id: 'v2-kpr',
    maxWrongAttempts: null,
    skillQueueCode: 'SQ_KPR',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['regular', 'priority', 'solitaire'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup([]),
      mandatory: createGroup([]),
      static: createGroup(
        [
          'q-pl-ktp-name',
          'q-prio-address-ktp',
          'q-kpr-registered-email',
          'q-kpr-registered-phone',
          'q-reg-account-type',
          'q-pl-echannel',
          'q-pl-ktp-number',
        ],
        5,
      ),
    },
    id: 'v2-personal-loan',
    maxWrongAttempts: 3,
    scenarios: [
      createScenario(
        'default',
        'Default',
        [
          createQuestionBlock(
            'static',
            'Static',
            [
              'q-pl-ktp-name',
              'q-prio-address-ktp',
              'q-kpr-registered-email',
              'q-kpr-registered-phone',
              'q-reg-account-type',
              'q-pl-echannel',
              'q-pl-ktp-number',
            ],
            5,
            'static',
          ),
        ],
        true,
        {
          agentHint:
            'Jika Nasabah salah menjawab 3 kali pertanyaan verifikasi maka CCO tidak bisa lanjut proses permohonan / permintaan nasabah',
        },
      ),
    ],
    skillQueueCode: 'SQ_PERSONAL_LOAN',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['regular', 'priority', 'solitaire'],
    groups: {
      alternative: createGroup(['q-merchant-alternative']),
      dynamic: createGroup([]),
      mandatory: createGroup([]),
      static: createGroup(['q-merchant-name', 'q-merchant-address'], 2),
    },
    id: 'v2-merchant-solution',
    maxWrongAttempts: null,
    skillQueueCode: 'SQ_MERCHANT_SOLUTION',
    specialRules: createSpecialRules({
      scenarios: [
        createSpecialScenario(
          'mbl-d',
          'Khusus laporan mbl d',
          [
            'q-merchant-name',
            'q-merchant-address',
            'q-merchant-owner',
          ],
          3,
          'replace',
        ),
      ],
    }),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
  {
    channelCodes: ['PHONE', 'BANKAPP'],
    customerSegments: ['regular', 'priority', 'solitaire'],
    groups: {
      alternative: createGroup([]),
      dynamic: createGroup([]),
      mandatory: createGroup(['q-reg-mother-maiden'], 1),
      static: createGroup(
        [
          'q-paylater-phone',
          'q-paylater-bank-id',
          'q-paylater-email',
          'q-reg-ktp-name',
          'q-paylater-limit',
          'q-paylater-last-transaction',
          'q-paylater-last-payment',
        ],
        4,
      ),
    },
    id: 'v2-paylater',
    maxWrongAttempts: 3,
    skillQueueCode: 'SQ_PAYLATER',
    specialRules: createSpecialRules(),
    status: 'enabled',
    updatedAt: '2026-06-12 15:30',
  },
]

const haloAppRegisteredRuleIds = new Set([
  'v2-bankapp-perbankan-registered',
  'v2-bankapp-card-regular',
])

const phoneAndHaloAppGuestRuleIds = new Set([
  'v2-phone-perbankan-regular',
  'v2-phone-card-regular',
])

export const verificationV2Rules: VerificationV2Rule[] = [
  ...baseVerificationV2Rules.map((rule) =>
    phoneAndHaloAppGuestRuleIds.has(rule.id)
      ? {
          ...rule,
          channelCodes: ['PHONE', 'BANKAPP'],
          haloAppLoginStatus: 'guest',
        }
      : rule.channelCodes.includes('BANKAPP')
      ? {
          ...rule,
          haloAppLoginStatus: haloAppRegisteredRuleIds.has(rule.id)
            ? 'registered'
            : 'all',
        }
      : rule,
  ),
]
