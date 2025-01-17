import { loadIsEnabled, loadOptions, loadIsAutoResetCodeEnabled, saveIsEnabled } from '../../storage'

import { toggleEnabled } from './toggleEnabled'
import { toggleInvertImageColor } from './toggleInvertImageColor'
import { toggleInvertImageColor2023 } from './toggleInvertImageColor2023'
import { toggleEnabledMascot } from './toggleEnabledMascot'
import { toggleHideLogo } from './toggleHideLogo'
import { toggleHideLogo2023 } from './toggleHideLogo2023'

import { OptionsForm } from '../../options'
import { ENABLED_STORAGE_KEY, OPTIONS_STORAGE_KEY } from '../../constants'

import { resetCode } from './resetCode'
import { resetCode2023 } from './resetCode2023'
import { detectLeetcodeVersion } from './leetcode-version'
import { onChangeIsDarkSide2023, setIsDarkSide2023 } from './darkSide2023'

async function toggleInvertImageColorByVersion (value: boolean) {
  const version = await detectLeetcodeVersion()
  if (version === 2023) {
    toggleInvertImageColor2023(value)
  } else if (version === 2022) {
    toggleInvertImageColor(value)
  }
}

async function toggleHideLogoByVersion (value: boolean) {
  const version = await detectLeetcodeVersion()
  if (version === 2023) {
    toggleHideLogo2023(value)
  } else if (version === 2022) {
    toggleHideLogo(value)
  }
}

const handleOptionsChange = (options: OptionsForm) => {
  toggleInvertImageColorByVersion(options?.invertImageColor ?? false)
  toggleEnabledMascot(options?.mascot ?? false)
  toggleHideLogoByVersion(options?.hideLogo ?? false)
}

async function toggleEnabledByVersion (value: boolean) {
  const version = await detectLeetcodeVersion()
  if (version === 2023) {
    setIsDarkSide2023(value)
  } else if (version === 2022) {
    toggleEnabled(value)
  }
}

async function resetCodeByVersion () {
  const version = await detectLeetcodeVersion()
  if (version === 2023) {
    resetCode2023()
  } else if (version === 2022) {
    resetCode()
  }
}

async function init () {
  chrome.storage.onChanged.addListener((changes) => {
    const isEnabled = changes[ENABLED_STORAGE_KEY]?.newValue
    if (isEnabled != null) toggleEnabledByVersion(isEnabled)

    const options = changes[OPTIONS_STORAGE_KEY]?.newValue
    if (options != null) handleOptionsChange(options)
  })

  toggleEnabledByVersion(await loadIsEnabled())
  onChangeIsDarkSide2023(saveIsEnabled)

  handleOptionsChange(await loadOptions())

  if (await loadIsAutoResetCodeEnabled()) {
    resetCodeByVersion()
  }
}

init()
