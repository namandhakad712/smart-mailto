'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { SmartMailto } from '@smart-mailto/react';
import {
  parseMailto,
  isValidMailtoParams,
  resolveProviders,
  spawnModal,
  type SmartMailtoConfig,
} from '@smart-mailto/core';

/* Shared script injected in right-side iframes to bridge mailto clicks to SmartMailto */
const SAMSUNG_SCRIPT =
  '<script>' +
  'document.addEventListener("click",function(e){' +
  'var a=e.target.closest("a[href^=\\"mailto:\\"]");' +
  'if(a){e.preventDefault();e.stopPropagation();' +
  'window.parent.postMessage({type:"smart-mailto",href:a.getAttribute("href")},"*");' +
  '}},true);' +
  '</script>';

/* Claude Support - Official Anthropic Marketing Email Addresses -- replica of support.claude.com */

const CLAUDE_BASE =
  '<!DOCTYPE html>' +
  '<html lang="en"><head>' +
  '<meta charset="utf-8"/>' +
  '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>' +
  '<title>Claude Support - Official Anthropic Marketing Email Addresses</title>' +
  '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600;700&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>' +
  '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>' +
  '<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>' +
  '<script>' +
  'tailwind.config={darkMode:"class",theme:{extend:{colors:{' +
  '"primary-container":"#1c1b1b","terracotta":"#CC785C","tertiary":"#000000",' +
  '"on-tertiary-fixed-variant":"#484645","on-secondary-fixed":"#390c00",' +
  '"secondary-fixed-dim":"#ffb59d","inverse-on-surface":"#f1f1ec",' +
  '"inverse-surface":"#2f312e","on-background":"#1a1c19",' +
  '"on-secondary-container":"#78361f","surface-variant":"#e3e3de",' +
  '"tertiary-fixed-dim":"#cac6c4","on-error":"#ffffff",' +
  '"primary-fixed-dim":"#c8c6c5","on-primary-container":"#858383",' +
  '"paper-white":"#FFFFFF","on-primary-fixed-variant":"#474746",' +
  '"primary-fixed":"#e5e2e1","primary":"#000000","tertiary-fixed":"#e6e2df",' +
  '"on-secondary-fixed-variant":"#75331c","on-surface":"#1a1c19","on-primary":"#ffffff",' +
  '"error-container":"#ffdad6","error":"#ba1a1a","surface-container-low":"#f4f4ef",' +
  '"on-primary-fixed":"#1c1b1b","on-tertiary-container":"#868382",' +
  '"surface-container-high":"#e8e8e3","secondary-fixed":"#ffdbd0",' +
  '"surface-container":"#eeeee9","surface-tint":"#5f5e5e",' +
  '"background":"#fafaf4","on-error-container":"#93000a","surface":"#fafaf4",' +
  '"inverse-primary":"#c8c6c5","on-surface-variant":"#444748",' +
  '"surface-bright":"#fafaf4","surface-container-lowest":"#ffffff",' +
  '"on-tertiary":"#ffffff","outline-variant":"#c4c7c7","ink":"#191919",' +
  '"surface-dim":"#dadad5","tertiary-container":"#1c1b1a",' +
  '"secondary-container":"#fea183","outline":"#747878",' +
  '"surface-container-highest":"#e3e3de","on-secondary":"#ffffff",' +
  '"parchment":"#F0F0EB","secondary":"#924a31","on-tertiary-fixed":"#1c1b1a"},' +
  'borderRadius:{DEFAULT:"0.125rem",lg:"0.25rem",xl:"0.5rem",full:"0.75rem"},' +
  'spacing:{"margin-mobile":"16px","margin-desktop":"40px",unit:"8px",gutter:"24px","container-max":"1120px"},' +
  'fontFamily:{"headline-xl":["Source Serif 4"],"body-lg":["Inter"],' +
  '"headline-md":["Source Serif 4"],"body-md":["Inter"],"label-md":["Inter"],' +
  '"label-sm":["Inter"],"headline-lg-mobile":["Source Serif 4"],"headline-lg":["Source Serif 4"]},' +
  'fontSize:{"headline-xl":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"600"}],' +
  '"body-lg":["18px",{"lineHeight":"28px","fontWeight":"400"}],' +
  '"headline-md":["24px",{"lineHeight":"32px","fontWeight":"500"}],' +
  '"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],' +
  '"label-md":["14px",{"lineHeight":"20px","letterSpacing":"0.02em","fontWeight":"500"}],' +
  '"label-sm":["12px",{"lineHeight":"16px","fontWeight":"600"}],' +
  '"headline-lg-mobile":["28px",{"lineHeight":"36px","fontWeight":"600"}],' +
  '"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}]}}}}' +
  '</script>' +
  '<style>' +
  '.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;display:inline-block;vertical-align:middle}' +
  'body{background-color:#fafaf4;color:#191919;font-family:Inter,sans-serif;margin:0;overflow:hidden}' +
  '.article-content p{margin-bottom:1.5rem;font-size:18px;line-height:28px}' +
  '.article-content ul{margin-bottom:1.5rem;list-style-type:disc;padding-left:1.5rem}' +
  '.article-content li{margin-bottom:0.5rem}' +
  '.claude-logo{font-size:18px;font-weight:700;color:#191919}' +
  '.btn-glow{position:relative;overflow:hidden;animation:pulse-glow 1.8s ease-in-out infinite;display:inline-block}' +
  '.btn-glow::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,#fff4,transparent 50%,#fff4);opacity:0;transition:opacity .3s}' +
  '.btn-glow:hover::after{opacity:1}' +
  '@keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(0,0,0,0);transform:scale(1)}50%{box-shadow:0 0 16px 4px rgba(0,0,0,0.12);transform:scale(1.03)}}' +
  '</style>' +
  '</head>' +
  '<body class="font-body-md text-body-md antialiased">' +
  '<header class="bg-paper-white border-b border-outline-variant sticky top-0 z-50">' +
  '<div class="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-16">' +
  '<div class="flex items-center gap-gutter">' +
  '<span class="claude-logo">Claude Support</span>' +
  '</div>' +
  '<nav class="hidden md:flex items-center gap-8">' +
  '<a class="font-label-md text-label-md text-on-surface-variant hover:text-terracotta transition-colors duration-200" href="#">API Docs</a>' +
  '<a class="font-label-md text-label-md text-on-surface-variant hover:text-terracotta transition-colors duration-200" href="#">Release Notes</a>' +
  '<a class="font-label-md text-label-md text-ink border-b-2 border-terracotta pb-1 transition-colors duration-200" href="#">How to Get Support</a>' +
  '<div class="flex items-center gap-1 cursor-pointer text-on-surface-variant hover:text-terracotta transition-colors">' +
  '<span class="material-symbols-outlined text-[18px]">language</span>' +
  '<span class="font-label-md text-label-md">Language Selector</span>' +
  '</div>' +
  '</nav>' +
  '<button class="md:hidden text-ink"><span class="material-symbols-outlined">menu</span></button>' +
  '</div>' +
  '</header>' +
  '<main class="min-h-screen">' +
  '<section class="bg-paper-white border-b border-outline-variant pt-12 pb-16">' +
  '<div class="max-w-[720px] mx-auto px-margin-mobile md:px-0 text-center">' +
  '<h1 class="font-headline-xl text-headline-xl mb-8">How can we help?</h1>' +
  '<div class="relative group">' +
  '<span class="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-terracotta transition-colors">search</span>' +
  '<input class="w-full h-14 pl-14 pr-6 bg-parchment border-none rounded-xl font-body-md focus:ring-2 focus:ring-terracotta transition-all outline-none text-ink" placeholder="Search for articles..." type="text"/>' +
  '</div>' +
  '</div>' +
  '</section>' +
  '<article class="max-w-container-max mx-auto px-margin-desktop py-12">' +
  '<div class="max-w-[720px] mx-auto">' +
  '<nav class="flex items-center gap-2 mb-8 text-on-surface-variant">' +
  '<a class="hover:text-terracotta transition-colors" href="#">All Collections</a>' +
  '<span class="material-symbols-outlined text-sm">chevron_right</span>' +
  '<a class="hover:text-terracotta transition-colors" href="#">Privacy and legal</a>' +
  '<span class="material-symbols-outlined text-sm">chevron_right</span>' +
  '<span class="text-ink truncate">Official Anthropic marketing email addresses</span>' +
  '</nav>' +
  '<header class="mb-10">' +
  '<h1 class="font-headline-lg text-headline-lg text-ink mb-4">Official Anthropic marketing email addresses</h1>' +
  '<div class="flex items-center gap-3 text-on-surface-variant font-label-sm uppercase tracking-wider">' +
  '<span>Updated March 16, 2026</span>' +
  '</div>' +
  '</header>' +
  '<div class="article-content text-ink">' +
  '<p>To help you identify legitimate communications from Anthropic, please be aware that we only send marketing and product update emails from a specific set of outbound-only email addresses. If you receive an email claiming to be from Anthropic that does not end in one of these domains, please exercise caution.</p>' +
  '<p>Our official outbound marketing email addresses include:</p>' +
  '<ul class="font-body-md">' +
  '<li><a class="text-terracotta hover:underline font-bold btn-glow" href="mailto:team@email.anthropic.com">team@email.anthropic.com</a> - General product updates and company announcements.</li>' +
  '<li><a class="text-terracotta hover:underline font-bold btn-glow" href="mailto:api@email.anthropic.com">api@email.anthropic.com</a> - Technical updates, documentation, and API-related news.</li>' +
  '<li><a class="text-terracotta hover:underline font-bold btn-glow" href="mailto:research@email.anthropic.com">research@email.anthropic.com</a> - Insights into our latest research papers and safety findings.</li>' +
  '<li><a class="text-terracotta hover:underline font-bold btn-glow" href="mailto:events@email.anthropic.com">events@email.anthropic.com</a> - Invitations to webinars, workshops, and community events.</li>' +
  '<li><a class="text-terracotta hover:underline font-bold btn-glow" href="mailto:billing@email.anthropic.com">billing@email.anthropic.com</a> - Invoices and payment-related notifications for Claude Pro and API users.</li>' +
  '</ul>' +
  '<div class="bg-surface-container-low border border-outline-variant p-6 rounded-lg my-8">' +
  '<div class="flex gap-4">' +
  '<span class="material-symbols-outlined text-terracotta" style="font-variation-settings:\'FILL\' 1;">info</span>' +
  '<div>' +
  '<p class="font-label-md font-bold mb-1">Safety First</p>' +
  '<p class="text-on-surface-variant text-sm mb-0">Anthropic will never ask for your password, credit card details via email, or sensitive personal information through these marketing channels. Always verify the sender address before clicking any links.</p>' +
  '</div>' +
  '</div>' +
  '</div>' +
  "<p>If you have any doubts about the authenticity of an email you've received, please reach out to our support team directly through the help center or via the official Claude interface.</p>" +
  '</div>' +
  '<hr class="my-12 border-outline-variant"/>' +
  '<section class="text-center py-8">' +
  '<h3 class="font-headline-md text-headline-md mb-6">Did this answer your question?</h3>' +
  '<div class="flex justify-center gap-8">' +
  '<button class="flex flex-col items-center gap-2 group hover:scale-110 transition-transform"><span class="text-4xl">😞</span><span class="font-label-sm text-on-surface-variant group-hover:text-ink">No</span></button>' +
  '<button class="flex flex-col items-center gap-2 group hover:scale-110 transition-transform"><span class="text-4xl">😐</span><span class="font-label-sm text-on-surface-variant group-hover:text-ink">Somewhat</span></button>' +
  '<button class="flex flex-col items-center gap-2 group hover:scale-110 transition-transform"><span class="text-4xl">😃</span><span class="font-label-sm text-on-surface-variant group-hover:text-ink">Yes</span></button>' +
  '</div>' +
  '</section>' +
  '<hr class="my-12 border-outline-variant"/>' +
  '<section>' +
  '<h3 class="font-label-sm uppercase tracking-widest text-on-surface-variant mb-6">Related Articles</h3>' +
  '<div class="grid gap-4">' +
  '<a class="block p-4 bg-paper-white border border-outline-variant rounded-lg hover:border-terracotta transition-colors group" href="#">' +
  '<div class="flex justify-between items-center"><span class="font-headline-md text-lg group-hover:text-terracotta transition-colors">How to report a security vulnerability</span><span class="material-symbols-outlined text-on-surface-variant">chevron_right</span></div>' +
  '</a>' +
  '<a class="block p-4 bg-paper-white border border-outline-variant rounded-lg hover:border-terracotta transition-colors group" href="#">' +
  '<div class="flex justify-between items-center"><span class="font-headline-md text-lg group-hover:text-terracotta transition-colors">Privacy Policy and Data Protection</span><span class="material-symbols-outlined text-on-surface-variant">chevron_right</span></div>' +
  '</a>' +
  '<a class="block p-4 bg-paper-white border border-outline-variant rounded-lg hover:border-terracotta transition-colors group" href="#">' +
  '<div class="flex justify-between items-center"><span class="font-headline-md text-lg group-hover:text-terracotta transition-colors">Setting up Two-Factor Authentication</span><span class="material-symbols-outlined text-on-surface-variant">chevron_right</span></div>' +
  '</a>' +
  '</div>' +
  '</section>' +
  '</div>' +
  '</article>' +
  '</main>' +
  '<footer class="bg-surface-container-low border-t border-outline-variant mt-20">' +
  '<div class="max-w-container-max mx-auto px-margin-desktop py-6 text-center">' +
  '<p class="font-label-sm text-on-surface-variant">&copy; 2026 Anthropic PBC. All rights reserved.</p>' +
  '</div>' +
  '</footer>' +
  '</body></html>';

const CLAUDE_LEFT = CLAUDE_BASE;
const CLAUDE_RIGHT = CLAUDE_BASE.slice(0, -14) + SAMSUNG_SCRIPT + '</body></html>';

/* Samsung Email Support -- replica of samsung.com/in/support/email/ */

const SAMSUNG_BASE =
  '<!DOCTYPE html>' +
  '<html lang="en"><head>' +
  '<meta charset="utf-8"/>' +
  '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>' +
  '<title>Samsung Support | Email Support</title>' +
  '<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>' +
  '<style>' +
  'body { font-family: "SamsungOne","Segoe UI",Arial,sans-serif; margin: 0; overflow: hidden; }' +
  '.hero-bg { background-image: linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url("https://images.samsung.com/is/image/samsung/assets/in/support/email/EmailService_PC.jpg?imwidth=1366"); background-size: cover; background-position: center; height: 350px; }' +
  '.hover-underline:hover { text-decoration: underline; }' +
  '.samsung-logo { display: flex; align-items: center; gap: 2px; }' +
  '.samsung-logo span { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: #1428A0; }' +
  '.btn-glow { position: relative; overflow: hidden; animation: pulse-glow 1.8s ease-in-out infinite; }' +
  '.btn-glow::after { content:""; position:absolute; inset:0; border-radius:inherit; background:linear-gradient(135deg,#fff4,transparent 50%,#fff4); opacity:0; transition:opacity .3s; }' +
  '.btn-glow:hover::after { opacity:1; }' +
  '@keyframes pulse-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); transform:scale(1); } 50% { box-shadow: 0 0 16px 4px rgba(0,0,0,0.12); transform:scale(1.03); } }' +
  '.btn-glow-dark { position:relative; overflow:hidden; animation:pulse-glow-dark 1.8s ease-in-out infinite; }' +
  '.btn-glow-dark::after { content:""; position:absolute; inset:0; border-radius:inherit; background:linear-gradient(135deg,#fff6,transparent 50%,#fff6); opacity:0; transition:opacity .3s; }' +
  '.btn-glow-dark:hover::after { opacity:1; }' +
  '@keyframes pulse-glow-dark { 0%,100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); transform:scale(1); } 50% { box-shadow: 0 0 20px 6px rgba(255,255,255,0.15); transform:scale(1.03); } }' +
  '</style>' +
  '</head>' +
  '<body class="bg-white text-black">' +
  '<header class="border-b border-gray-200 sticky top-0 bg-white z-50">' +
  '<div class="max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between h-16">' +
  '<div class="flex items-center space-x-8">' +
  '<a class="inline-block samsung-logo" href="#"><span>SAMSUNG</span></a>' +
  '<nav class="hidden lg:flex space-x-6 text-sm font-bold">' +
  '<a class="hover-underline" href="#">Shop</a>' +
  '<a class="hover-underline" href="#">Mobile</a>' +
  '<a class="hover-underline" href="#">TV & AV</a>' +
  '<a class="hover-underline" href="#">Appliances</a>' +
  '<a class="hover-underline" href="#">Computers & Monitors</a>' +
  '<a class="hover-underline" href="#">Wearables</a>' +
  '<a class="hover-underline" href="#">Accessories</a>' +
  '</nav>' +
  '</div>' +
  '<div class="flex items-center space-x-4">' +
  '<nav class="hidden lg:flex space-x-4 text-sm font-bold mr-4">' +
  '<a class="border-b-2 border-black pb-1" href="#">Support</a>' +
  '<a class="hover-underline" href="#">For Business</a>' +
  '</nav>' +
  '<button class="p-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg></button>' +
  '<button class="p-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg></button>' +
  '<button class="p-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg></button>' +
  '</div>' +
  '</div>' +
  '</header>' +
  '<main>' +
  '<section class="hero-bg flex items-center justify-center text-center px-4">' +
  '<h1 class="text-white text-4xl md:text-6xl font-bold tracking-tight">Drop us an e-mail</h1>' +
  '</section>' +
  '<section class="py-16 px-4 max-w-7xl mx-auto">' +
  '<h2 class="text-center text-3xl font-bold mb-12">Please Select Your Request Type</h2>' +
  '<div class="grid md:grid-cols-2 gap-8 bg-gray-50 rounded-2xl p-10">' +
  '<div class="text-center flex flex-col items-center border-r border-gray-200 md:px-12">' +
  '<div class="w-20 h-20 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">' +
  '<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>' +
  '</div>' +
  '<h3 class="text-xl font-bold mb-4">Customer Service</h3>' +
  '<p class="text-sm text-gray-600 mb-8 max-w-xs">Get answer for your general & technical queries.</p>' +
  '<div class="flex space-x-4">' +
  '<a class="px-6 py-2 border border-black rounded-full text-xs font-bold hover:bg-black hover:text-white transition-colors" href="#">WHATSAPP US</a>' +
  '<a class="px-6 py-2 border border-black rounded-full text-xs font-bold hover:bg-black hover:text-white transition-colors uppercase btn-glow" href="mailto:samsung.service@samsung.com">Email Us</a>' +
  '</div>' +
  '</div>' +
  '<div class="text-center flex flex-col items-center md:px-12">' +
  '<div class="w-20 h-20 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">' +
  '<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>' +
  '</div>' +
  '<h3 class="text-xl font-bold mb-4">Samsung Shop - Customer Service</h3>' +
  '<p class="text-sm text-gray-600 mb-8 max-w-xs">Get answers for your Samsung Shop order queries.</p>' +
  '<a class="px-8 py-2 border border-black rounded-full text-xs font-bold hover:bg-black hover:text-white transition-colors btn-glow" href="mailto:samsung.service@samsung.com">CONTACT US</a>' +
  '</div>' +
  '</div>' +
  '</section>' +
  '<section class="py-16 px-4 max-w-7xl mx-auto">' +
  '<h2 class="text-center text-3xl font-bold mb-12">Contact Info</h2>' +
  '<div class="grid md:grid-cols-3 gap-6">' +
  '<div class="border border-gray-200 rounded-3xl p-8 flex flex-col justify-between h-[450px]">' +
  '<div>' +
  '<h3 class="text-xl font-bold">Digital Service Center</h3>' +
  '<p class="text-sm text-gray-600">Get customized support, access to DIY videos and FAQs.</p>' +
  '</div>' +
  '<a class="inline-flex items-center bg-black text-white px-6 py-2 rounded-full text-xs font-bold btn-glow-dark" href="mailto:samsung.service@samsung.com">Click here</a>' +
  '</div>' +
  '<div class="border border-gray-200 rounded-3xl p-8 flex flex-col justify-between h-[450px]">' +
  '<div>' +
  '<h3 class="text-xl font-bold">WhatsApp</h3>' +
  '<p class="text-sm text-gray-600">WhatsApp us for services-related interaction.</p>' +
  '<p class="text-sm text-gray-600">Available 24 Hours / 7 days</p>' +
  '</div>' +
  '</div>' +
  '<div class="border border-gray-200 rounded-3xl p-8 flex flex-col h-[450px]">' +
  '<h3 class="text-xl font-bold">Email Support</h3>' +
  '<p class="text-sm text-gray-600">We will respond within 24 hours of your request.</p>' +
  '<a class="inline-flex items-center bg-black text-white px-8 py-2 rounded-full text-xs font-bold btn-glow-dark" href="mailto:samsung.service@samsung.com">Email Us</a>' +
  '</div>' +
  '</div>' +
  '</section>' +
  '</main>' +
  '<footer class="bg-white pt-4 pb-2 border-t border-gray-200">' +
  '<div class="max-w-[1440px] mx-auto px-4">' +
  '<div class="text-xs text-gray-500">Copyright 1995-2026 SAMSUNG All Rights reserved.</div>' +
  '</div>' +
  '</footer>';

const SAMSUNG_LEFT = SAMSUNG_BASE + '</body></html>';
const SAMSUNG_RIGHT = SAMSUNG_BASE + SAMSUNG_SCRIPT + '</body></html>';

/* Google Image Library -- replica of blog.google/image-library/ */

const GOOGLE_BASE =
  '<!DOCTYPE html>' +
  '<html lang="en"><head>' +
  '<meta charset="utf-8"/>' +
  '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>' +
  '<title>Image Library - The Keyword</title>' +
  '<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap" rel="stylesheet"/>' +
  '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>' +
  '<script>' +
  'tailwind.config={darkMode:"class",theme:{extend:{colors:{primary:"#005bbf","surface-container-lowest":"#ffffff","on-tertiary-fixed-variant":"#46474a","surface-container":"#eeeeee","on-surface":"#1a1c1c","on-secondary-fixed-variant":"#43474c","secondary-fixed":"#dfe3e8","tertiary-fixed":"#e3e2e6","on-tertiary-fixed":"#1a1b1e","on-surface-variant":"#414754","surface-container-low":"#f3f3f4","surface":"#f9f9f9","on-background":"#1a1c1c","on-tertiary":"#ffffff","tertiary-fixed-dim":"#c7c6ca","on-primary-fixed":"#001a41","on-secondary-container":"#5f6368","tertiary-container":"#76767a","on-primary-container":"#ffffff","on-tertiary-container":"#ffffff","surface-variant":"#e2e2e2","error":"#ba1a1a","outline-variant":"#c1c6d6","secondary-container":"#dde0e6","primary-container":"#1a73e8","inverse-surface":"#2f3131","surface-container-highest":"#e2e2e2","inverse-on-surface":"#f0f1f1","surface-tint":"#005bc0","text-primary":"#202124","error-container":"#ffdad6","inverse-primary":"#adc7ff","on-secondary-fixed":"#181c20","surface-dim":"#dadada","secondary":"#5b5f64","text-secondary":"#5F6368","border-subtle":"#DADCE0","primary-fixed-dim":"#adc7ff","on-primary":"#ffffff","outline":"#727785","surface-container-high":"#e8e8e8","primary-fixed":"#d8e2ff","on-primary-fixed-variant":"#004493","tertiary":"#5d5d61","secondary-fixed-dim":"#c3c7cc","on-secondary":"#ffffff","background":"#f9f9f9","surface-bright":"#f9f9f9","on-error":"#ffffff","on-error-container":"#93000a"},borderRadius:{DEFAULT:"0.25rem",lg:"0.5rem",xl:"0.75rem",full:"9999px"},spacing:{"container-max":"1280px",gutter:"24px","margin-mobile":"20px","margin-desktop":"64px",unit:"8px"},fontFamily:{"headline-lg-mobile":["Plus Jakarta Sans","sans-serif"],"body-md":["Inter","sans-serif"],"label-sm":["Inter","sans-serif"],"headline-lg":["Plus Jakarta Sans","sans-serif"],"label-lg":["Inter","sans-serif"],"headline-md":["Plus Jakarta Sans","sans-serif"],"display-lg":["Plus Jakarta Sans","sans-serif"],"body-lg":["Inter","sans-serif"]},fontSize:{"headline-lg-mobile":["28px",{lineHeight:"36px",fontWeight:"600"}],"body-md":["16px",{lineHeight:"24px",fontWeight:"400"}],"label-sm":["12px",{lineHeight:"16px",letterSpacing:"0.02em",fontWeight:"500"}],"headline-lg":["32px",{lineHeight:"40px",letterSpacing:"-0.01em",fontWeight:"600"}],"label-lg":["14px",{lineHeight:"20px",letterSpacing:"0.01em",fontWeight:"500"}],"headline-md":["24px",{lineHeight:"32px",fontWeight:"500"}],"display-lg":["56px",{lineHeight:"64px",letterSpacing:"-0.02em",fontWeight:"700"}],"body-lg":["18px",{lineHeight:"28px",fontWeight:"400"}]}}}}' +
  '</script>' +
  '<style>' +
  '.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;display:inline-block;vertical-align:middle}' +
  'body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}' +
  'h1,h2,h3,.font-headline{font-family:"Plus Jakarta Sans",sans-serif}' +
  '</style>' +
  '</head>' +
  '<body class="bg-surface text-on-surface">' +
  '<header class="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border-subtle">' +
  '<div class="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center h-16">' +
  '<div class="flex items-center gap-8">' +
  '<a class="flex items-center gap-2" href="/">' +
  '<img alt="Google" class="h-6" src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"/>' +
  '<span class="font-headline-md text-headline-md font-bold text-on-surface ml-1">The Keyword</span>' +
  '</a>' +
  '<nav class="hidden md:flex items-center gap-6">' +
  '<a class="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Home</a>' +
  '<div class="group relative"><button class="flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors duration-200">Innovation &amp; AI <span class="material-symbols-outlined text-sm">expand_more</span></button></div>' +
  '<div class="group relative"><button class="flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors duration-200">Products &amp; Platforms <span class="material-symbols-outlined text-sm">expand_more</span></button></div>' +
  '<div class="group relative"><button class="flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors duration-200">Company news <span class="material-symbols-outlined text-sm">expand_more</span></button></div>' +
  '<a class="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Feed</a>' +
  '</nav>' +
  '</div>' +
  '<div class="flex items-center gap-4">' +
  '<div class="hidden sm:flex items-center gap-4 text-on-surface-variant">' +
  '<button class="p-2 hover:bg-surface-container rounded-full transition-colors"><span class="material-symbols-outlined">search</span></button>' +
  '<button class="p-2 hover:bg-surface-container rounded-full transition-colors"><span class="material-symbols-outlined">language</span></button>' +
  '<button class="p-2 hover:bg-surface-container rounded-full transition-colors"><span class="material-symbols-outlined">more_vert</span></button>' +
  '</div>' +
  '<button class="bg-primary-container text-on-primary-container font-label-lg text-label-lg px-6 py-2 rounded-full hover:shadow-lg transition-all active:scale-95">Subscribe</button>' +
  '</div>' +
  '</div>' +
  '</header>' +
  '<main class="pt-16">' +
  '<section class="max-w-container-max mx-auto px-margin-desktop py-12 md:py-24">' +
  '<div class="grid md:grid-cols-2 gap-12 items-center">' +
  '<div class="relative order-2 md:order-1 flex justify-center md:justify-start">' +
  '<img alt="Image Library Illustration" class="w-full max-w-[540px] h-auto object-contain" src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Thekeyword_presscorner.width-1500.format-webp.webp"/>' +
  '</div>' +
  '<div class="order-1 md:order-2 space-y-6">' +
  '<h1 class="font-display-lg text-display-lg text-on-surface">Image Library</h1>' +
  '<div class="space-y-4 max-w-lg">' +
  '<p class="font-body-lg text-body-lg text-on-surface-variant">Images on this page may be used for publication with credit: <span class="font-semibold text-on-surface">"Source: Google."</span></p>' +
  '<p class="font-body-md text-body-md text-on-surface-variant">For press inquiries, email <a class="text-primary hover:underline font-medium" href="mailto:press@google.com">press@google.com</a>. Only members of the press will receive a response.</p>' +
  '<p class="font-body-md text-body-md text-on-surface-variant">For all other inquiries please visit Google\'s <a class="text-primary hover:underline font-medium" href="#">Help Center</a>.</p>' +
  '</div>' +
  '<div class="pt-4 flex gap-4">' +
  '<button class="flex items-center gap-2 font-label-lg text-label-lg text-on-surface-variant border border-outline px-4 py-2 rounded-lg hover:bg-surface-container transition-colors"><span class="material-symbols-outlined">share</span> Share</button>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '</section>' +
  '<div class="max-w-container-max mx-auto px-margin-desktop">' +
  '<hr class="border-border-subtle"/>' +
  '</div>' +
  '</main>' +
  '</body></html>';

const GOOGLE_LEFT = GOOGLE_BASE;
const GOOGLE_RIGHT = GOOGLE_BASE.slice(0, -14) + SAMSUNG_SCRIPT + '</body></html>';

/* Hyundai India Contact Us -- replica of hyundai.com/in/en/utility/contact-us */

const HYUNDAI_BASE =
  '<!DOCTYPE html>' +
  '<html lang="en"><head>' +
  '<meta charset="utf-8"/>' +
  '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>' +
  '<title>Contact Us | HYUNDAI India</title>' +
  '<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>' +
  '<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>' +
  '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>' +
  '<script>' +
  'tailwind.config={darkMode:"class",theme:{extend:{colors:{"hyundai-blue":"#002C5F","surface-mist":"#F6F3F2",' +
  '"surface":"#f0edec","surface-container-highest":"#e5e2e1","on-surface":"#1b1c1b",' +
  '"on-surface-variant":"#43474f","secondary":"#5e5e5e","on-primary":"#ffffff",' +
  '"background":"#fcf9f8","surface-dim":"#dcd9d8","surface-bright":"#fcf9f8"},' +
  'fontFamily:{"display-lg":["Hanken Grotesk","sans-serif"],"headline-md":["Hanken Grotesk","sans-serif"],' +
  '"headline-sm":["Hanken Grotesk","sans-serif"],"body-lg":["Hanken Grotesk","sans-serif"],' +
  '"body-md":["Hanken Grotesk","sans-serif"],"label-md":["Hanken Grotesk","sans-serif"],' +
  '"label-sm":["Hanken Grotesk","sans-serif"]},' +
  'fontSize:{"display-lg":["48px",{"lineHeight":"56px","fontWeight":"700"}],' +
  '"display-lg-mobile":["32px",{"lineHeight":"40px","fontWeight":"700"}],' +
  '"headline-md":["24px",{"lineHeight":"32px","fontWeight":"600"}],' +
  '"headline-sm":["20px",{"lineHeight":"28px","fontWeight":"600"}],' +
  '"body-lg":["18px",{"lineHeight":"28px"}],' +
  '"body-md":["16px",{"lineHeight":"24px"}],' +
  '"label-md":["14px",{"lineHeight":"20px","letterSpacing":"0.05em","fontWeight":"600"}],' +
  '"label-sm":["12px",{"lineHeight":"16px","letterSpacing":"0.05em","fontWeight":"600"}]},' +
  'spacing:{"container-max":"1280px","gutter":"24px","margin-desktop":"64px",' +
  '"margin-mobile":"20px"}}}}' +
  '</script>' +
  '<style>' +
  '.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;display:inline-block;vertical-align:middle}' +
  'body{font-family:"Hanken Grotesk",sans-serif;margin:0;overflow:hidden}' +
  '.hyundai-logo{font-size:24px;font-weight:700;color:#002C5F;letter-spacing:-1px}' +
  '.btn-glow{position:relative;overflow:hidden;animation:pulse-glow 1.8s ease-in-out infinite}' +
  '.btn-glow::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,#fff4,transparent 50%,#fff4);opacity:0;transition:opacity .3s}' +
  '.btn-glow:hover::after{opacity:1}' +
  '@keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(0,0,0,0);transform:scale(1)}50%{box-shadow:0 0 16px 4px rgba(0,0,0,0.12);transform:scale(1.03)}}' +
  '</style>' +
  '</head>' +
  '<body class="bg-background text-on-surface">' +
  '<header class="fixed top-0 w-full z-50 bg-surface border-b border-surface-container-highest h-16">' +
  '<div class="flex justify-between items-center px-margin-desktop h-full w-full max-w-container-max mx-auto">' +
  '<div class="flex items-center gap-8">' +
  '<span class="hyundai-logo">HYUNDAI</span>' +
  '<nav class="hidden md:flex items-center gap-6 font-body-md text-body-md">' +
  '<a class="text-on-surface-variant hover:text-hyundai-blue transition-colors duration-200" href="#">Find a Car</a>' +
  '<a class="text-on-surface-variant hover:text-hyundai-blue transition-colors duration-200" href="#">Click to Buy</a>' +
  '<a class="text-on-surface-variant hover:text-hyundai-blue transition-colors duration-200" href="#">Connect to Service</a>' +
  '<a class="text-on-surface-variant hover:text-hyundai-blue transition-colors duration-200" href="#">Hyundai Story</a>' +
  '<a class="text-hyundai-blue font-bold border-b-2 border-hyundai-blue pb-1" href="#">Contact Us</a>' +
  '</nav>' +
  '</div>' +
  '<div class="flex items-center gap-4 text-on-surface-variant">' +
  '<span class="material-symbols-outlined cursor-pointer hover:text-hyundai-blue">person</span>' +
  '<span class="material-symbols-outlined cursor-pointer hover:text-hyundai-blue">location_on</span>' +
  '<span class="material-symbols-outlined cursor-pointer hover:text-hyundai-blue">share</span>' +
  '<span class="material-symbols-outlined cursor-pointer hover:text-hyundai-blue">search</span>' +
  '</div>' +
  '</div>' +
  '</header>' +
  '<main class="pt-16">' +
  '<div class="bg-surface-mist py-4">' +
  '<div class="max-w-container-max mx-auto px-margin-desktop">' +
  '<nav class="flex text-label-sm uppercase tracking-wider text-secondary">' +
  '<a class="hover:text-hyundai-blue transition-colors" href="#">Home</a>' +
  '<span class="mx-2">&gt;</span>' +
  '<span class="text-on-surface font-bold">Contact Us</span>' +
  '</nav>' +
  '</div>' +
  '</div>' +
  '<section class="bg-surface-mist py-16 text-center">' +
  '<div class="max-w-3xl mx-auto px-margin-desktop">' +
  '<h1 class="font-display-lg text-display-lg mb-6 text-hyundai-blue">A Smarter Way to Connect</h1>' +
  '<p class="font-body-lg text-body-lg text-secondary">Your complete satisfaction is of primary importance to us. Should you ever have questions or comments about your Hyundai vehicle, we suggest you follow these steps so your concerns can be addressed as quickly and efficiently as possible.</p>' +
  '</div>' +
  '</section>' +
  '<section class="py-16 max-w-container-max mx-auto px-margin-desktop">' +
  '<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">' +
  '<div class="bg-surface border border-surface-container-highest p-8 flex flex-col text-center">' +
  '<h2 class="font-headline-md text-headline-md mb-4 text-hyundai-blue">Enquiry</h2>' +
  '<p class="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">For any queries related to Product, Price, Company, Dealership, Warranty, Service, Finance, Insurance and vehicle support. Please submit your queries on the links given below. Our representative will contact you shortly.</p>' +
  '<div class="flex gap-4 justify-center">' +
  '<a class="bg-hyundai-blue text-on-primary px-6 py-3 font-label-md uppercase tracking-widest hover:opacity-90 transition-opacity" href="#">Sales Enquiry</a>' +
  '<a class="bg-hyundai-blue text-on-primary px-6 py-3 font-label-md uppercase tracking-widest hover:opacity-90 transition-opacity" href="#">Service Enquiry</a>' +
  '</div>' +
  '</div>' +
  '<div class="bg-surface border border-surface-container-highest p-8 flex flex-col text-center">' +
  '<h2 class="font-headline-md text-headline-md mb-4 text-hyundai-blue">Feedback</h2>' +
  '<p class="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow">Express your grievances and feedback to executive team regarding our products and service. Your message will be promptly handled under the direct supervision of our executive management.</p>' +
  '<div class="flex gap-4 justify-center">' +
  '<a class="bg-hyundai-blue text-on-primary px-6 py-3 font-label-md uppercase tracking-widest hover:opacity-90 transition-opacity" href="#">Sales Feedback</a>' +
  '<a class="bg-hyundai-blue text-on-primary px-6 py-3 font-label-md uppercase tracking-widest hover:opacity-90 transition-opacity" href="#">Service Feedback</a>' +
  '</div>' +
  '</div>' +
  '<div class="bg-surface border border-surface-container-highest p-8 flex flex-col text-center">' +
  '<h2 class="font-headline-md text-headline-md mb-4 text-hyundai-blue">Call Us</h2>' +
  '<p class="font-body-md text-body-md text-on-surface-variant mb-8">For a quick response, we request you to be ready with your vehicle registration number or VIN number. Call us for enquiry / feedback at</p>' +
  '<div class="flex flex-col gap-2 font-headline-sm text-headline-sm text-hyundai-blue">' +
  '<a class="hover:underline" href="tel:1800114645">1800 114 645</a>' +
  '<a class="hover:underline" href="tel:9873564645">9873564645</a>' +
  '</div>' +
  '</div>' +
  '<div class="bg-surface border border-surface-container-highest p-8 flex flex-col text-center">' +
  '<h2 class="font-headline-md text-headline-md mb-4 text-hyundai-blue">Email us</h2>' +
  '<p class="font-body-md text-body-md text-on-surface-variant mb-8">If for any reason, you are not able to register your enquiry/ feedback please write to us on following email</p>' +
  '<a class="font-headline-sm text-headline-sm text-hyundai-blue hover:underline inline-block btn-glow" href="mailto:customercare@hmil.net">customercare@hmil.net</a>' +
  '</div>' +
  '<div class="bg-surface border border-surface-container-highest p-8 flex flex-col text-center">' +
  '<h2 class="font-headline-md text-headline-md mb-4 text-hyundai-blue">WhatsApp Us</h2>' +
  '<p class="font-body-md text-body-md text-on-surface-variant mb-8">Send "Hi" to below mentioned WhatsApp number to explore Hyundai Cars, book a test-drive, book a service, raise a complaint, find a Dealer and much more!</p>' +
  '<a class="font-headline-sm text-headline-sm text-hyundai-blue mb-8 block hover:underline" href="https://wa.me/918447228019">8447228019</a>' +
  '<div class="flex justify-center">' +
  '<a class="bg-hyundai-blue text-on-primary px-10 py-3 font-label-md uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2" href="https://wa.me/918447228019">WhatsApp</a>' +
  '</div>' +
  '</div>' +
  '<div class="bg-surface border border-surface-container-highest p-8 flex flex-col text-center">' +
  '<h2 class="font-headline-md text-headline-md mb-4 text-hyundai-blue">Connect to CEO</h2>' +
  '<p class="font-body-md text-body-md text-on-surface-variant mb-8">For any Escalation | Feedback | Suggestion</p>' +
  '<div class="font-body-md text-body-md text-secondary">Email: <a class="text-hyundai-blue font-bold hover:underline btn-glow" href="mailto:ceo.hyundaiindia@hmil.net">ceo.hyundaiindia@hmil.net</a></div>' +
  '</div>' +
  '</div>' +
  '</section>' +
  '<section class="bg-hyundai-blue text-on-primary py-12">' +
  '<div class="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">' +
  '<div>' +
  '<h3 class="font-headline-md text-headline-md uppercase tracking-widest mb-2">24/7 Roadside Assistance</h3>' +
  '<p class="font-body-md opacity-80">Our experts are available around the clock to assist you with any vehicle emergencies.</p>' +
  '</div>' +
  '<div class="text-center md:text-right">' +
  '<span class="font-label-sm uppercase block opacity-70 mb-1">Toll Free Number</span>' +
  '<a class="font-display-lg text-display-lg-mobile md:text-display-lg hover:underline decoration-white/30" href="tel:18001024645">1800 102 4645</a>' +
  '</div>' +
  '</div>' +
  '</section>' +
  '</main>' +
  '<footer class="bg-surface-container border-t border-surface-container-highest py-6">' +
  '<div class="max-w-container-max mx-auto px-margin-desktop text-center text-label-md text-secondary">' +
  'Copyright &copy; 2026 Hyundai Motor India. All Rights Reserved.' +
  '</div>' +
  '</footer>' +
  '</body></html>';

const HYUNDAI_LEFT = HYUNDAI_BASE;
const HYUNDAI_RIGHT = HYUNDAI_BASE.slice(0, -14) + SAMSUNG_SCRIPT + '</body></html>';

/* Supabase Contact Us -- replica of supabase.com/contact-us */

const SUPABASE_BASE =
  '<!DOCTYPE html>' +
  '<html class="dark" lang="en"><head>' +
  '<meta charset="utf-8"/>' +
  '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>' +
  '<title>Contact Us | Supabase</title>' +
  '<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>' +
  '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&amp;family=JetBrains+Mono:wght@400;600&amp;display=swap" rel="stylesheet"/>' +
  '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>' +
  '<script>' +
  'tailwind.config={darkMode:"class",theme:{extend:{colors:{' +
  '"surface-container":"#201f1f","surface-studio":"#1C1C1C","on-surface":"#e5e2e1",' +
  '"on-surface-variant":"#bbcabe","primary":"#60eca8","primary-container":"#3ecf8e",' +
  '"on-primary-container":"#005434","on-primary":"#003822","background":"#131313",' +
  '"surface":"#131313","interface-border":"#2E2E2E","text-muted":"#8B8B8B",' +
  '"error":"#ffb4ab","outline":"#869489","outline-variant":"#3d4a41",' +
  '"secondary":"#c8c6c5","surface-bright":"#3a3939","surface-dim":"#131313",' +
  '"surface-container-high":"#2a2a2a","surface-container-highest":"#353534",' +
  '"surface-container-low":"#1c1b1b","surface-container-lowest":"#0e0e0e",' +
  '"on-secondary-container":"#b7b5b4","pure-black":"#000000"},' +
  'borderRadius:{DEFAULT:"0.125rem",lg:"0.25rem",xl:"0.5rem",full:"0.75rem"},' +
  'spacing:{gutter:"24px","margin-desktop":"48px","container-max":"1280px",' +
  '"margin-mobile":"16px"},' +
  'fontFamily:{"headline-xl":["Plus Jakarta Sans"],"headline-lg":["Plus Jakarta Sans"],' +
  '"body-md":["Plus Jakarta Sans"],"body-sm":["Plus Jakarta Sans"],' +
  '"label-caps":["JetBrains Mono"],"code-sm":["JetBrains Mono"],' +
  '"code-md":["JetBrains Mono"]},' +
  'fontSize:{"headline-xl":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"700"}],' +
  '"headline-lg":["32px",{"lineHeight":"40px","letterSpacing":"-0.01em","fontWeight":"600"}],' +
  '"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],' +
  '"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}],' +
  '"label-caps":["11px",{"lineHeight":"16px","letterSpacing":"0.05em","fontWeight":"600"}],' +
  '"code-sm":["12px",{"lineHeight":"18px","fontWeight":"400"}],' +
  '"code-md":["14px",{"lineHeight":"22px","fontWeight":"400"}]}}}}' +
  '</script>' +
  '<style>' +
  '.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;display:inline-block;vertical-align:middle}' +
  'body{background-color:#131313;font-family:"Plus Jakarta Sans",sans-serif;margin:0;overflow:hidden}' +
  '.supabase-logo{font-size:20px;font-weight:700;color:#e5e2e1;letter-spacing:-0.5px}' +
  '.btn-glow{position:relative;overflow:hidden;animation:pulse-glow 1.8s ease-in-out infinite}' +
  '.btn-glow::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,#fff4,transparent 50%,#fff4);opacity:0;transition:opacity .3s}' +
  '.btn-glow:hover::after{opacity:1}' +
  '@keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0);transform:scale(1)}50%{box-shadow:0 0 16px 4px rgba(255,255,255,0.1);transform:scale(1.03)}}' +
  '</style>' +
  '</head>' +
  '<body class="text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">' +
  '<header class="bg-background border-b border-interface-border sticky top-0 z-50">' +
  '<div class="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto">' +
  '<div class="flex items-center gap-8">' +
  '<a class="flex items-center gap-2 font-headline-lg text-headline-lg font-bold text-on-surface" href="/">' +
  '<span class="supabase-logo">Supabase</span>' +
  '</a>' +
  '<nav class="hidden md:flex items-center gap-6">' +
  '<a class="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-200" href="#">Product</a>' +
  '<a class="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-200" href="#">Developers</a>' +
  '<a class="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-200" href="#">Solutions</a>' +
  '<a class="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-200" href="#">Pricing</a>' +
  '<a class="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-200" href="#">Docs</a>' +
  '<a class="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors duration-200" href="#">Blog</a>' +
  '</nav>' +
  '</div>' +
  '<div class="flex items-center gap-4">' +
  '<div class="hidden lg:flex items-center gap-2 px-3 py-1 bg-surface-container rounded-lg border border-interface-border">' +
  '<span class="material-symbols-outlined text-[18px]">star</span>' +
  '<span class="font-code-sm text-code-sm">103K</span>' +
  '</div>' +
  '<a class="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors" href="#">Sign in</a>' +
  '<a class="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-caps text-label-caps font-bold hover:opacity-90 transition-all" href="#">Start your project</a>' +
  '</div>' +
  '</div>' +
  '</header>' +
  '<main class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">' +
  '<div class="mb-16 md:mb-24">' +
  '<h1 class="font-headline-xl text-headline-xl mb-6 tracking-tighter">Contact Us</h1>' +
  '<div class="max-w-2xl space-y-4">' +
  '<p class="font-body-md text-body-md text-on-surface-variant">Need help? Want to report something? Have a legal question?</p>' +
  '<p class="font-body-md text-body-md text-on-surface-variant">Use the right channel below so we can get you to the right team quickly.</p>' +
  '</div>' +
  '</div>' +
  '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-x-16 lg:gap-y-20">' +
  '<section class="space-y-4 border-t border-interface-border pt-8 relative overflow-hidden group">' +
  '<div class="w-8 h-[2px] bg-primary absolute top-0 left-0 transition-all duration-300 group-hover:w-full"></div>' +
  '<h2 class="font-headline-lg text-headline-lg">Legal</h2>' +
  '<a class="block font-label-caps text-label-caps text-primary hover:underline decoration-2 underline-offset-4 btn-glow" href="mailto:legal@supabase.com">legal@supabase.com</a>' +
  '<p class="font-body-sm text-body-sm text-on-surface-variant">For general legal inquiries.</p>' +
  '</section>' +
  '<section class="space-y-4 border-t border-interface-border pt-8 relative overflow-hidden group">' +
  '<div class="w-8 h-[2px] bg-primary absolute top-0 left-0 transition-all duration-300 group-hover:w-full"></div>' +
  '<h2 class="font-headline-lg text-headline-lg">Privacy</h2>' +
  '<a class="block font-label-caps text-label-caps text-primary hover:underline decoration-2 underline-offset-4 btn-glow" href="mailto:privacy@supabase.com">privacy@supabase.com</a>' +
  '<p class="font-body-sm text-body-sm text-on-surface-variant">For questions about personal data, data subject rights requests, GDPR/CCPA inquiries, or how Supabase processes personal information.</p>' +
  '</section>' +
  '<section class="space-y-4 border-t border-interface-border pt-8 relative overflow-hidden group">' +
  '<div class="w-8 h-[2px] bg-primary absolute top-0 left-0 transition-all duration-300 group-hover:w-full"></div>' +
  '<h2 class="font-headline-lg text-headline-lg">Abuse &amp; Acceptable Use</h2>' +
  '<a class="block font-label-caps text-label-caps text-primary hover:underline decoration-2 underline-offset-4 btn-glow" href="mailto:abuse@supabase.com">abuse@supabase.com</a>' +
  '<p class="font-body-sm text-body-sm text-on-surface-variant">To report suspected violations of our Acceptable Use Policy, including spam, phishing, malware, or unlawful activity involving Supabase services.</p>' +
  '</section>' +
  '<section class="space-y-4 border-t border-interface-border pt-8 relative overflow-hidden group">' +
  '<div class="w-8 h-[2px] bg-primary absolute top-0 left-0 transition-all duration-300 group-hover:w-full"></div>' +
  '<h2 class="font-headline-lg text-headline-lg">Security</h2>' +
  '<a class="block font-label-caps text-label-caps text-primary hover:underline decoration-2 underline-offset-4 btn-glow" href="mailto:security@supabase.com">security@supabase.com</a>' +
  '<p class="font-body-sm text-body-sm text-on-surface-variant">To responsibly disclose potential security vulnerabilities or report suspected security incidents involving Supabase infrastructure or services.</p>' +
  '</section>' +
  '<section class="space-y-4 border-t border-interface-border pt-8 relative overflow-hidden group">' +
  '<div class="w-8 h-[2px] bg-primary absolute top-0 left-0 transition-all duration-300 group-hover:w-full"></div>' +
  '<h2 class="font-headline-lg text-headline-lg">Events</h2>' +
  '<a class="block font-label-caps text-label-caps text-primary hover:underline decoration-2 underline-offset-4 btn-glow" href="mailto:help-events@supabase.com">help-events@supabase.com</a>' +
  "<p class=\"font-body-sm text-body-sm text-on-surface-variant\">For hackathon or event sponsorship requests. While we can't sponsor every event, we'd love to hear about yours. We'll follow up if it's a good fit.</p>" +
  '</section>' +
  '<section class="space-y-4 border-t border-interface-border pt-8 relative overflow-hidden group">' +
  '<div class="w-8 h-[2px] bg-primary absolute top-0 left-0 transition-all duration-300 group-hover:w-full"></div>' +
  '<h2 class="font-headline-lg text-headline-lg">Grievance Officer</h2>' +
  '<div class="space-y-1">' +
  '<a class="block font-label-caps text-label-caps text-primary hover:underline decoration-2 underline-offset-4 btn-glow" href="mailto:legal@supabase.com">legal@supabase.com</a>' +
  '<p class="font-code-sm text-code-sm text-on-surface-variant">Attn: Tracy Lane</p>' +
  '</div>' +
  '<p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">In jurisdictions that require the designation of a Grievance Officer or similar compliance contact, Tracy Lane, General Counsel of Supabase, Inc., serves in that role. Formal complaints, regulatory inquiries, or legally required grievance submissions may be directed to the email above.</p>' +
  '<p class="font-body-sm text-body-sm text-on-surface-variant italic opacity-80">Supabase will acknowledge receipt of grievances and respond within the timeframe required by applicable law.</p>' +
  '</section>' +
  '</div>' +
  '</main>' +
  '<footer class="bg-background border-t border-interface-border mt-12">' +
  '<div class="max-w-container-max mx-auto px-margin-desktop py-6 text-center">' +
  '<p class="font-body-sm text-body-sm text-text-muted">&copy; 2026 Supabase Inc.</p>' +
  '</div>' +
  '</footer>' +
  '<script>' +
  'document.querySelectorAll("section").forEach(function(card){' +
  'card.addEventListener("mouseenter",function(){var b=card.querySelector(".bg-primary");if(b)b.style.height="4px"});' +
  'card.addEventListener("mouseleave",function(){var b=card.querySelector(".bg-primary");if(b)b.style.height="2px"})' +
  '});' +
  '</script>' +
  '</body></html>';

const SUPABASE_LEFT = SUPABASE_BASE;
const SUPABASE_RIGHT = SUPABASE_BASE.slice(0, -14) + SAMSUNG_SCRIPT + '</body></html>';

/* Moonshot AI Footer -- replica of platform.moonshot.ai/ */

const MOONSHOT_BASE =
  '<!DOCTYPE html>' +
  '<html class="dark" lang="en"><head>' +
  '<meta charset="utf-8"/>' +
  '<meta content="width=device-width, initial-scale=1.0" name="viewport"/>' +
  '<title>Moonshot AI Platform - Footer</title>' +
  '<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>' +
  '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>' +
  '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&amp;family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>' +
  '<script>' +
  'tailwind.config={darkMode:"class",theme:{extend:{colors:{' +
  '"surface-container-high":"#2a2a2a","inverse-surface":"#e5e2e1","surface-tint":"#c6c6c7",' +
  '"outline-variant":"#444748","border-muted":"#333333","on-tertiary-container":"#636565",' +
  '"surface-dim":"#131313","on-primary-fixed-variant":"#454747","deep-black":"#000000",' +
  '"secondary-fixed-dim":"#c6c6c7","secondary":"#c6c6c7","outline":"#8e9192",' +
  '"secondary-fixed":"#e2e2e2","surface-variant":"#353534","surface-container-lowest":"#0e0e0e",' +
  '"on-primary-fixed":"#1a1c1c","primary-container":"#e2e2e2","on-secondary-container":"#b4b5b5",' +
  '"on-secondary-fixed":"#1a1c1c","on-background":"#e5e2e1","on-primary-container":"#636565",' +
  '"surface":"#131313","inverse-primary":"#5d5f5f","tertiary-container":"#e2e2e2",' +
  '"tertiary-fixed":"#e2e2e2","surface-bright":"#393939","on-surface":"#e5e2e1",' +
  '"on-error-container":"#ffdad6","error":"#ffb4ab","primary-fixed-dim":"#c6c6c7",' +
  '"inverse-on-surface":"#313030","tertiary":"#ffffff","on-secondary-fixed-variant":"#454747",' +
  '"on-secondary":"#2f3131","on-tertiary":"#2f3131","error-container":"#93000a",' +
  '"secondary-container":"#454747","tertiary-fixed-dim":"#c6c6c7","on-error":"#690005",' +
  '"primary":"#ffffff","surface-container":"#201f1f","on-primary":"#2f3131",' +
  '"text-dimmed":"#A1A1AA","surface-container-low":"#1c1b1b","background":"#131313",' +
  '"on-tertiary-fixed-variant":"#454747","on-tertiary-fixed":"#1a1c1c",' +
  '"on-surface-variant":"#c4c7c8","primary-fixed":"#e2e2e2","surface-container-highest":"#353534"},' +
  'borderRadius:{DEFAULT:"0.125rem",lg:"0.25rem",xl:"0.5rem",full:"0.75rem"},' +
  'spacing:{gutter:"24px","max-width":"1280px",unit:"4px","margin-desktop":"64px","margin-mobile":"16px"},' +
  'fontFamily:{"headline-lg-mobile":["Source Serif 4"],"button-text":["Inter"],' +
  '"label-mono":["JetBrains Mono"],"headline-lg":["Source Serif 4"],' +
  '"display-lg":["Source Serif 4"],"body-md":["Inter"],"body-sm":["Inter"]},' +
  'fontSize:{"headline-lg-mobile":["32px",{"lineHeight":"40px","fontWeight":"500"}],' +
  '"button-text":["14px",{"lineHeight":"16px","letterSpacing":"0.02em","fontWeight":"600"}],' +
  '"label-mono":["12px",{"lineHeight":"16px","letterSpacing":"0.05em","fontWeight":"500"}],' +
  '"headline-lg":["40px",{"lineHeight":"48px","fontWeight":"500"}],' +
  '"display-lg":["64px",{"lineHeight":"72px","letterSpacing":"-0.02em","fontWeight":"600"}],' +
  '"body-md":["16px",{"lineHeight":"24px","fontWeight":"400"}],' +
  '"body-sm":["14px",{"lineHeight":"20px","fontWeight":"400"}]}}}}' +
  '</script>' +
  '<style>' +
  '.material-symbols-outlined{font-variation-settings:"FILL" 0,"wght" 400,"GRAD" 0,"opsz" 24;display:inline-block;vertical-align:middle}' +
  'body{margin:0;background-color:#000;overflow:hidden;font-family:Inter,sans-serif}' +
  '.social-icon:hover{border-color:#fff;color:#fff;transform:translateY(-2px)}' +
  '.btn-glow{position:relative;overflow:hidden;animation:pulse-glow 1.8s ease-in-out infinite;display:inline-block}' +
  '.btn-glow::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,#fff4,transparent 50%,#fff4);opacity:0;transition:opacity .3s}' +
  '.btn-glow:hover::after{opacity:1}' +
  '@keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0);transform:scale(1)}50%{box-shadow:0 0 16px 4px rgba(255,255,255,0.1);transform:scale(1.03)}}' +
  '</style>' +
  '</head>' +
  '<body class="antialiased text-on-surface bg-deep-black">' +
  '<footer class="w-full relative bg-deep-black border-t border-border-muted">' +
  '<div class="grid grid-cols-12 gap-gutter px-margin-desktop py-20 max-w-max-width mx-auto">' +
  '<div class="col-span-12 md:col-span-4 mb-12 md:mb-0">' +
  '<div class="font-display-lg text-display-lg font-bold tracking-tighter text-primary uppercase mb-8">KIMI</div>' +
  '<div class="flex gap-4">' +
  '<a aria-label="X (Twitter)" class="social-icon flex items-center justify-center w-10 h-10 rounded-full border border-border-muted text-text-dimmed transition-all duration-300" href="https://x.com/Kimi_Moonshot">' +
  '<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>' +
  '</a>' +
  '<a aria-label="GitHub" class="social-icon flex items-center justify-center w-10 h-10 rounded-full border border-border-muted text-text-dimmed transition-all duration-300" href="https://github.com/MoonshotAI">' +
  '<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>' +
  '</a>' +
  '<a aria-label="LinkedIn" class="social-icon flex items-center justify-center w-10 h-10 rounded-full border border-border-muted text-text-dimmed transition-all duration-300" href="https://www.linkedin.com/company/kimi-ai-linkedin/">' +
  '<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>' +
  '</a>' +
  '</div>' +
  '</div>' +
  '<div class="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">' +
  '<div class="flex flex-col">' +
  '<h4 class="font-headline-lg text-[18px] text-primary mb-6">Contact</h4>' +
  '<nav class="flex flex-col space-y-4">' +
  '<a class="font-body-sm text-body-sm text-text-dimmed hover:text-primary transition-colors duration-200 cursor-pointer" href="https://forum.moonshot.ai/">Forum</a>' +
  '<a class="font-body-sm text-body-sm text-text-dimmed hover:text-primary transition-colors duration-200 cursor-pointer" href="https://discord.gg/TYU2fdJykW">Discord</a>' +
  '<a class="font-body-sm text-body-sm text-text-dimmed hover:text-primary transition-colors duration-200 cursor-pointer btn-glow" href="mailto:contact@moonshot.ai">Email Us</a>' +
  '</nav>' +
  '</div>' +
  '<div class="flex flex-col">' +
  '<h4 class="font-headline-lg text-[18px] text-primary mb-6">Legal</h4>' +
  '<nav class="flex flex-col space-y-4">' +
  '<a class="font-body-sm text-body-sm text-text-dimmed hover:text-primary transition-colors duration-200 cursor-pointer" href="/docs/agreement/modeluse">Platform Terms of Service</a>' +
  '<a class="font-body-sm text-body-sm text-text-dimmed hover:text-primary transition-colors duration-200 cursor-pointer" href="/docs/agreement/userprivacy">Privacy Policy</a>' +
  '</nav>' +
  '</div>' +
  '<div class="flex flex-col">' +
  '<h4 class="font-headline-lg text-[18px] text-primary mb-6">Company</h4>' +
  '<nav class="flex flex-col space-y-4">' +
  '<a class="font-body-sm text-body-sm text-text-dimmed hover:text-primary transition-colors duration-200 cursor-pointer" href="https://www.moonshot.ai">Moonshot Website</a>' +
  '<a class="font-body-sm text-body-sm text-text-dimmed hover:text-primary transition-colors duration-200 cursor-pointer" href="https://kimi.com">Kimi</a>' +
  '<a class="font-body-sm text-body-sm text-text-dimmed hover:text-primary transition-colors duration-200 cursor-pointer" href="https://www.kimi.com/code?from=kimi_platform">Kimi Code</a>' +
  '</nav>' +
  '</div>' +
  '</div>' +
  '</div>' +
  '<div class="max-w-max-width mx-auto px-margin-desktop py-12 border-t border-border-muted">' +
  '<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">' +
  '<p class="font-body-sm text-body-sm text-text-dimmed tracking-tight">&copy; 2026 Moonshot AI. Built for the elite.</p>' +
  '<div class="flex gap-6"><span class="font-label-mono text-label-mono text-text-dimmed uppercase tracking-widest opacity-50">v1.24.06</span></div>' +
  '</div>' +
  '</div>' +
  '<div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50"></div>' +
  '</footer>' +
  '<div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">' +
  '<div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1a1a1a_0%,#000000_60%)]"></div>' +
  '</div>' +
  '</body></html>';

const MOONSHOT_LEFT = MOONSHOT_BASE;
const MOONSHOT_RIGHT = MOONSHOT_BASE.slice(0, -14) + SAMSUNG_SCRIPT + '</body></html>';

/* PAGE */

export default function ExamplesPage() {
  const claudeLeftRef = useRef<HTMLDivElement>(null);
  const claudeRightRef = useRef<HTMLDivElement>(null);
  const claudeScrolling = useRef(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const scrolling = useRef(false);
  const leftIframeRef = useRef<HTMLIFrameElement>(null);
  const rightIframeRef = useRef<HTMLIFrameElement>(null);
  const googleLeftRef = useRef<HTMLDivElement>(null);
  const googleRightRef = useRef<HTMLDivElement>(null);
  const googleScrolling = useRef(false);
  const hyundaiLeftRef = useRef<HTMLDivElement>(null);
  const hyundaiRightRef = useRef<HTMLDivElement>(null);
  const hyundaiScrolling = useRef(false);
  const supabaseLeftRef = useRef<HTMLDivElement>(null);
  const supabaseRightRef = useRef<HTMLDivElement>(null);
  const supabaseScrolling = useRef(false);
  const moonshotLeftRef = useRef<HTMLDivElement>(null);
  const moonshotRightRef = useRef<HTMLDivElement>(null);
  const moonshotScrolling = useRef(false);

  const onClaudeLeftScroll = useCallback(() => {
    if (claudeScrolling.current) return;
    claudeScrolling.current = true;
    const left = claudeLeftRef.current;
    const right = claudeRightRef.current;
    if (left && right) {
      const progress = left.scrollTop / (left.scrollHeight - left.clientHeight || 1);
      right.scrollTop = progress * (right.scrollHeight - right.clientHeight);
    }
    claudeScrolling.current = false;
  }, []);

  const onClaudeRightScroll = useCallback(() => {
    if (claudeScrolling.current) return;
    claudeScrolling.current = true;
    const left = claudeLeftRef.current;
    const right = claudeRightRef.current;
    if (left && right) {
      const progress = right.scrollTop / (right.scrollHeight - right.clientHeight || 1);
      left.scrollTop = progress * (left.scrollHeight - left.clientHeight);
    }
    claudeScrolling.current = false;
  }, []);

  const onLeftScroll = useCallback(() => {
    if (scrolling.current) return;
    scrolling.current = true;
    const left = leftRef.current;
    const right = rightRef.current;
    if (left && right) {
      const progress = left.scrollTop / (left.scrollHeight - left.clientHeight || 1);
      right.scrollTop = progress * (right.scrollHeight - right.clientHeight);
    }
    scrolling.current = false;
  }, []);

  const onRightScroll = useCallback(() => {
    if (scrolling.current) return;
    scrolling.current = true;
    const left = leftRef.current;
    const right = rightRef.current;
    if (left && right) {
      const progress = right.scrollTop / (right.scrollHeight - right.clientHeight || 1);
      left.scrollTop = progress * (left.scrollHeight - left.clientHeight);
    }
    scrolling.current = false;
  }, []);

  const onGoogleLeftScroll = useCallback(() => {
    if (googleScrolling.current) return;
    googleScrolling.current = true;
    const left = googleLeftRef.current;
    const right = googleRightRef.current;
    if (left && right) {
      const progress = left.scrollTop / (left.scrollHeight - left.clientHeight || 1);
      right.scrollTop = progress * (right.scrollHeight - right.clientHeight);
    }
    googleScrolling.current = false;
  }, []);

  const onGoogleRightScroll = useCallback(() => {
    if (googleScrolling.current) return;
    googleScrolling.current = true;
    const left = googleLeftRef.current;
    const right = googleRightRef.current;
    if (left && right) {
      const progress = right.scrollTop / (right.scrollHeight - right.clientHeight || 1);
      left.scrollTop = progress * (left.scrollHeight - left.clientHeight);
    }
    googleScrolling.current = false;
  }, []);

  const onHyundaiLeftScroll = useCallback(() => {
    if (hyundaiScrolling.current) return;
    hyundaiScrolling.current = true;
    const left = hyundaiLeftRef.current;
    const right = hyundaiRightRef.current;
    if (left && right) {
      const progress = left.scrollTop / (left.scrollHeight - left.clientHeight || 1);
      right.scrollTop = progress * (right.scrollHeight - right.clientHeight);
    }
    hyundaiScrolling.current = false;
  }, []);

  const onHyundaiRightScroll = useCallback(() => {
    if (hyundaiScrolling.current) return;
    hyundaiScrolling.current = true;
    const left = hyundaiLeftRef.current;
    const right = hyundaiRightRef.current;
    if (left && right) {
      const progress = right.scrollTop / (right.scrollHeight - right.clientHeight || 1);
      left.scrollTop = progress * (left.scrollHeight - left.clientHeight);
    }
    hyundaiScrolling.current = false;
  }, []);

  const onSupabaseLeftScroll = useCallback(() => {
    if (supabaseScrolling.current) return;
    supabaseScrolling.current = true;
    const left = supabaseLeftRef.current;
    const right = supabaseRightRef.current;
    if (left && right) {
      const progress = left.scrollTop / (left.scrollHeight - left.clientHeight || 1);
      right.scrollTop = progress * (right.scrollHeight - right.clientHeight);
    }
    supabaseScrolling.current = false;
  }, []);

  const onSupabaseRightScroll = useCallback(() => {
    if (supabaseScrolling.current) return;
    supabaseScrolling.current = true;
    const left = supabaseLeftRef.current;
    const right = supabaseRightRef.current;
    if (left && right) {
      const progress = right.scrollTop / (right.scrollHeight - right.clientHeight || 1);
      left.scrollTop = progress * (left.scrollHeight - left.clientHeight);
    }
    supabaseScrolling.current = false;
  }, []);

  const onMoonshotLeftScroll = useCallback(() => {
    if (moonshotScrolling.current) return;
    moonshotScrolling.current = true;
    const left = moonshotLeftRef.current;
    const right = moonshotRightRef.current;
    if (left && right) {
      const progress = left.scrollTop / (left.scrollHeight - left.clientHeight || 1);
      right.scrollTop = progress * (right.scrollHeight - right.clientHeight);
    }
    moonshotScrolling.current = false;
  }, []);

  const onMoonshotRightScroll = useCallback(() => {
    if (moonshotScrolling.current) return;
    moonshotScrolling.current = true;
    const left = moonshotLeftRef.current;
    const right = moonshotRightRef.current;
    if (left && right) {
      const progress = right.scrollTop / (right.scrollHeight - right.clientHeight || 1);
      left.scrollTop = progress * (left.scrollHeight - left.clientHeight);
    }
    moonshotScrolling.current = false;
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'smart-mailto' && typeof event.data?.href === 'string') {
        const params = parseMailto(event.data.href);
        if (!isValidMailtoParams(params)) return;
        const config: SmartMailtoConfig = { theme: 'light', autoDetectGeo: true };
        const resolved = resolveProviders(params, config);
        spawnModal(params, resolved, config);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-16 space-y-16">
      {/* HEADER */}
      <div className="text-center">
        <span className="font-mono text-xs font-bold text-red uppercase tracking-[0.3em] block mb-2">
          Side by Side
        </span>
        <h1 className="text-4xl font-headline font-normal text-ink dark:text-text">
          Before vs. After
        </h1>
        <p className="font-headline text-xl md:text-2xl font-semibold text-ink dark:text-text mt-2 max-w-3xl mx-auto leading-snug">
          Even the biggest tech companies ship{' '}
          <code className="font-mono text-sm bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400 font-bold">
            mailto:
          </code>{' '}
          links that break when no mail client is configured.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-700 dark:text-red-400">
          <span className="font-bold">This is a visualization of a real problem:</span> even the
          biggest tech companies ship broken email links.
        </div>
      </div>

      {/* ──────────────────────────────────────────── */}
      {/* EXAMPLE 1: Claude / Anthropic Support        */}
      {/* ──────────────────────────────────────────── */}

      {/* HEADER */}
      <div className="text-center">
        <p className="font-headline text-xl md:text-2xl font-semibold text-ink dark:text-text mt-2 max-w-3xl mx-auto leading-snug">
          Even Anthropic&rsquo;s own{' '}
          <a
            href="https://support.claude.com/en/articles/10416553-official-anthropic-marketing-email-addresses"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 text-ink dark:text-text hover:text-[#CC785C] transition-colors"
          >
            Claude Support
          </a>{' '}
          article about official email addresses doesn&rsquo;t make them clickable &mdash;
          they&rsquo;re just plain text.
        </p>
      </div>

      <div className="border border-border dark:border-border overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-3 border-b border-border dark:border-border bg-surface dark:bg-surface-container">
          <div
            className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-sm"
            style={{ backgroundColor: '#CC785C', color: '#fff' }}
          >
            C
          </div>
          <span className="font-headline text-sm font-medium text-ink dark:text-text">
            Anthropic / Claude Support
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border dark:divide-border">
          {/* BEFORE */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-red/20 flex items-center justify-center text-[8px]">
                X
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-red font-bold">
                Before smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={claudeLeftRef}
                onScroll={onClaudeLeftScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={CLAUDE_LEFT}
                  title="Claude Support -- broken"
                  style={{
                    width: '100%',
                    height: 3500,
                    border: '1px solid #c4c7c7',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50">
              <span className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>!</span>
                Five official email addresses listed &mdash; none are clickable. Users must
                copy-paste.
              </span>
            </div>
          </div>

          {/* AFTER */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-[8px]">
                V
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-green-600 dark:text-green-400 font-bold">
                After smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={claudeRightRef}
                onScroll={onClaudeRightScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={CLAUDE_RIGHT}
                  title="Claude Support -- fixed"
                  style={{
                    width: '100%',
                    height: 3500,
                    border: '1px solid #c4c7c7',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-green-50 dark:bg-green-950/30 border-t border-green-100 dark:border-green-900/50 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-green-700 dark:text-green-400 flex items-center gap-1">
                <span>V</span>
                Click any email &mdash; SmartMailto opens the modal
              </span>
              <SmartMailto
                href="mailto:team@email.anthropic.com"
                theme="light"
                className="inline-flex items-center bg-[#CC785C] text-white px-5 py-1.5 rounded-full text-xs font-bold hover:bg-[#b8654a] transition-colors no-underline"
              >
                Email team@email.anthropic.com -- Try It
              </SmartMailto>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON CARD */}
      <div className="border border-border dark:border-border overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-3 border-b border-border dark:border-border bg-surface dark:bg-surface-container">
          <div
            className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-sm"
            style={{ backgroundColor: '#1428A0', color: '#fff' }}
          >
            S
          </div>
          <span className="font-headline text-sm font-medium text-ink dark:text-text">Samsung</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border dark:divide-border">
          {/* BEFORE: replica with broken mailto links */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-red/20 flex items-center justify-center text-[8px]">
                X
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-red font-bold">
                Before smart-mailto
              </span>
            </div>
            <div
              ref={leftRef}
              onScroll={onLeftScroll}
              style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
            >
              <iframe
                ref={leftIframeRef}
                srcDoc={SAMSUNG_LEFT}
                title="Samsung Email Support -- broken"
                style={{ width: '100%', height: 5000, border: 'none', display: 'block' }}
              />
            </div>
            <div className="px-5 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50">
              <span className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>!</span>
                All &ldquo;Email Us&rdquo; links use plain{' '}
                <code className="font-mono text-[9px]">mailto:</code> — no mail app configured,
                browser shows an error. The email never gets sent.
              </span>
            </div>
          </div>

          {/* AFTER: replica + working SmartMailto */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-[8px]">
                V
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-green-600 dark:text-green-400 font-bold">
                After smart-mailto
              </span>
            </div>
            <div
              ref={rightRef}
              onScroll={onRightScroll}
              style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
            >
              <iframe
                ref={rightIframeRef}
                srcDoc={SAMSUNG_RIGHT}
                title="Samsung Email Support -- fixed"
                style={{ width: '100%', height: 5000, border: 'none', display: 'block' }}
              />
            </div>
            <div className="px-5 py-3 bg-green-50 dark:bg-green-950/30 border-t border-green-100 dark:border-green-900/50 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-green-700 dark:text-green-400 flex items-center gap-1">
                <span>V</span>
                Click any &ldquo;Email Us&rdquo; link inside the page &mdash; SmartMailto intercepts
                it
              </span>
              <SmartMailto
                href="mailto:samsung.service@samsung.com?subject=Support%20Request"
                theme="light"
                className="inline-flex items-center bg-black text-white px-5 py-1.5 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors no-underline"
              >
                Email Us -- Try It
              </SmartMailto>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTNOTE */}
      <div className="text-center text-xs text-ink-soft dark:text-text-muted leading-relaxed">
        Both panels show the same replica of Samsung&rsquo;s Email Support page. The{' '}
        <strong className="text-red">left</strong> keeps the original{' '}
        <code className="font-mono text-[10px]">mailto:</code> links (broken). The{' '}
        <strong className="text-green-600">right</strong> adds smart-mailto so the &ldquo;Email
        Us&rdquo; button actually works — no mail client required.
      </div>

      {/* ──────────────────────────────────────────── */}
      {/* EXAMPLE 2: Google Image Library             */}
      {/* ──────────────────────────────────────────── */}

      {/* HEADER */}
      <div className="text-center">
        <p className="font-headline text-xl md:text-2xl font-semibold text-ink dark:text-text mt-2 max-w-3xl mx-auto leading-snug">
          Even Google's official{' '}
          <a
            href="https://blog.google/image-library/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 text-ink dark:text-text hover:text-[#1a73e8] transition-colors"
          >
            Image Library
          </a>{' '}
          uses a plain{' '}
          <code className="font-mono text-sm bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400 font-bold">
            mailto:
          </code>{' '}
          link for press inquiries.
        </p>
      </div>

      <div className="border border-border dark:border-border overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-3 border-b border-border dark:border-border bg-surface dark:bg-surface-container">
          <div
            className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-sm"
            style={{ backgroundColor: '#1a73e8', color: '#fff' }}
          >
            G
          </div>
          <span className="font-headline text-sm font-medium text-ink dark:text-text">
            Google Image Library
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border dark:divide-border">
          {/* BEFORE */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-red/20 flex items-center justify-center text-[8px]">
                X
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-red font-bold">
                Before smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={googleLeftRef}
                onScroll={onGoogleLeftScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={GOOGLE_LEFT}
                  title="Google Image Library -- broken"
                  style={{
                    width: '100%',
                    height: 2000,
                    border: '1px solid #e2e2e2',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50">
              <span className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>!</span>
                The &ldquo;press@google.com&rdquo; link uses plain{' '}
                <code className="font-mono text-[9px]">mailto:</code> &mdash; no mail client = dead
                end.
              </span>
            </div>
          </div>

          {/* AFTER */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-[8px]">
                V
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-green-600 dark:text-green-400 font-bold">
                After smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={googleRightRef}
                onScroll={onGoogleRightScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={GOOGLE_RIGHT}
                  title="Google Image Library -- fixed"
                  style={{
                    width: '100%',
                    height: 2000,
                    border: '1px solid #e2e2e2',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-green-50 dark:bg-green-950/30 border-t border-green-100 dark:border-green-900/50 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-green-700 dark:text-green-400 flex items-center gap-1">
                <span>V</span>
                Click &ldquo;press@google.com&rdquo; &mdash; SmartMailto intercepts it
              </span>
              <SmartMailto
                href="mailto:press@google.com"
                theme="light"
                className="inline-flex items-center bg-[#1a73e8] text-white px-5 py-1.5 rounded-full text-xs font-bold hover:bg-[#1557b0] transition-colors no-underline"
              >
                Email press@google.com -- Try It
              </SmartMailto>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────── */}
      {/* EXAMPLE 3: Hyundai India Contact Us          */}
      {/* ──────────────────────────────────────────── */}

      {/* HEADER */}
      <div className="text-center">
        <p className="font-headline text-xl md:text-2xl font-semibold text-ink dark:text-text mt-2 max-w-3xl mx-auto leading-snug">
          Even Hyundai&rsquo;s official{' '}
          <a
            href="https://www.hyundai.com/in/en/utility/contact-us"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 text-ink dark:text-text hover:text-[#002C5F] transition-colors"
          >
            Contact Us
          </a>{' '}
          page ships plain{' '}
          <code className="font-mono text-sm bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400 font-bold">
            mailto:
          </code>{' '}
          links for customer email.
        </p>
      </div>

      <div className="border border-border dark:border-border overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-3 border-b border-border dark:border-border bg-surface dark:bg-surface-container">
          <div
            className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-sm"
            style={{ backgroundColor: '#002C5F', color: '#fff' }}
          >
            H
          </div>
          <span className="font-headline text-sm font-medium text-ink dark:text-text">
            Hyundai India Contact Us
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border dark:divide-border">
          {/* BEFORE */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-red/20 flex items-center justify-center text-[8px]">
                X
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-red font-bold">
                Before smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={hyundaiLeftRef}
                onScroll={onHyundaiLeftScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={HYUNDAI_LEFT}
                  title="Hyundai Contact Us -- broken"
                  style={{
                    width: '100%',
                    height: 4000,
                    border: '1px solid #e5e2e1',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50">
              <span className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>!</span>
                Both &ldquo;customercare@hmil.net&rdquo; and &ldquo;ceo.hyundaiindia@hmil.net&rdquo;
                use plain <code className="font-mono text-[9px]">mailto:</code> &mdash; no mail
                client configured = dead end.
              </span>
            </div>
          </div>

          {/* AFTER */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-[8px]">
                V
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-green-600 dark:text-green-400 font-bold">
                After smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={hyundaiRightRef}
                onScroll={onHyundaiRightScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={HYUNDAI_RIGHT}
                  title="Hyundai Contact Us -- fixed"
                  style={{
                    width: '100%',
                    height: 4000,
                    border: '1px solid #e5e2e1',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-green-50 dark:bg-green-950/30 border-t border-green-100 dark:border-green-900/50 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-green-700 dark:text-green-400 flex items-center gap-1">
                <span>V</span>
                Click any email link &mdash; SmartMailto intercepts it
              </span>
              <SmartMailto
                href="mailto:customercare@hmil.net"
                theme="light"
                className="inline-flex items-center bg-[#002C5F] text-white px-5 py-1.5 rounded-full text-xs font-bold hover:bg-[#001a3a] transition-colors no-underline"
              >
                Email customercare@hmil.net -- Try It
              </SmartMailto>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────── */}
      {/* EXAMPLE 4: Supabase Contact Us               */}
      {/* ──────────────────────────────────────────── */}

      {/* HEADER */}
      <div className="text-center">
        <p className="font-headline text-xl md:text-2xl font-semibold text-ink dark:text-text mt-2 max-w-3xl mx-auto leading-snug">
          Even Supabase&rsquo;s official{' '}
          <a
            href="https://supabase.com/contact-us"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 text-ink dark:text-text hover:text-[#60eca8] transition-colors"
          >
            Contact Us
          </a>{' '}
          page ships plain{' '}
          <code className="font-mono text-sm bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400 font-bold">
            mailto:
          </code>{' '}
          links across multiple contact channels.
        </p>
      </div>

      <div className="border border-border dark:border-border overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-3 border-b border-border dark:border-border bg-surface dark:bg-surface-container">
          <div
            className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-sm"
            style={{ backgroundColor: '#3ecf8e', color: '#003822' }}
          >
            S
          </div>
          <span className="font-headline text-sm font-medium text-ink dark:text-text">
            Supabase Contact Us
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border dark:divide-border">
          {/* BEFORE */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-red/20 flex items-center justify-center text-[8px]">
                X
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-red font-bold">
                Before smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={supabaseLeftRef}
                onScroll={onSupabaseLeftScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={SUPABASE_LEFT}
                  title="Supabase Contact Us -- broken"
                  style={{
                    width: '100%',
                    height: 3500,
                    border: '1px solid #2E2E2E',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50">
              <span className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>!</span>
                All six contact channels use plain{' '}
                <code className="font-mono text-[9px]">mailto:</code> &mdash; no mail client = dead
                end.
              </span>
            </div>
          </div>

          {/* AFTER */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-[8px]">
                V
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-green-600 dark:text-green-400 font-bold">
                After smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={supabaseRightRef}
                onScroll={onSupabaseRightScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={SUPABASE_RIGHT}
                  title="Supabase Contact Us -- fixed"
                  style={{
                    width: '100%',
                    height: 3500,
                    border: '1px solid #2E2E2E',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-green-50 dark:bg-green-950/30 border-t border-green-100 dark:border-green-900/50 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-green-700 dark:text-green-400 flex items-center gap-1">
                <span>V</span>
                Click any email link &mdash; SmartMailto intercepts it
              </span>
              <SmartMailto
                href="mailto:legal@supabase.com"
                theme="light"
                className="inline-flex items-center bg-[#3ecf8e] text-[#003822] px-5 py-1.5 rounded-full text-xs font-bold hover:bg-[#35b87d] transition-colors no-underline"
              >
                Email legal@supabase.com -- Try It
              </SmartMailto>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────── */}
      {/* EXAMPLE 6: Moonshot AI Footer               */}
      {/* ──────────────────────────────────────────── */}

      {/* HEADER */}
      <div className="text-center">
        <p className="font-headline text-xl md:text-2xl font-semibold text-ink dark:text-text mt-2 max-w-3xl mx-auto leading-snug">
          Even Moonshot AI&rsquo;s{' '}
          <a
            href="https://platform.moonshot.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 text-ink dark:text-text hover:text-white transition-colors"
          >
            platform footer
          </a>{' '}
          ships a plain{' '}
          <code className="font-mono text-sm bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400 font-bold">
            mailto:
          </code>{' '}
          link for &ldquo;Email Us&rdquo;.
        </p>
      </div>

      <div className="border border-border dark:border-border overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-3 border-b border-border dark:border-border bg-surface dark:bg-surface-container">
          <div
            className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-sm"
            style={{ backgroundColor: '#fff', color: '#000' }}
          >
            M
          </div>
          <span className="font-headline text-sm font-medium text-ink dark:text-text">
            Moonshot AI Footer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border dark:divide-border">
          {/* BEFORE */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-red/20 flex items-center justify-center text-[8px]">
                X
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-red font-bold">
                Before smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={moonshotLeftRef}
                onScroll={onMoonshotLeftScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={MOONSHOT_LEFT}
                  title="Moonshot AI Footer -- broken"
                  style={{
                    width: '100%',
                    height: 1500,
                    border: '1px solid #333',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-100 dark:border-red-900/50">
              <span className="text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>!</span>
                The &ldquo;Email Us&rdquo; link uses plain{' '}
                <code className="font-mono text-[9px]">mailto:</code> &mdash; no mail client = dead
                end.
              </span>
            </div>
          </div>

          {/* AFTER */}
          <div>
            <div className="flex items-center gap-2 px-5 pt-3 pb-0">
              <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-[8px]">
                V
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-green-600 dark:text-green-400 font-bold">
                After smart-mailto
              </span>
            </div>
            <div className="mx-5 my-4">
              <div
                ref={moonshotRightRef}
                onScroll={onMoonshotRightScroll}
                style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}
              >
                <iframe
                  srcDoc={MOONSHOT_RIGHT}
                  title="Moonshot AI Footer -- fixed"
                  style={{
                    width: '100%',
                    height: 1500,
                    border: '1px solid #333',
                    display: 'block',
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-green-50 dark:bg-green-950/30 border-t border-green-100 dark:border-green-900/50 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-green-700 dark:text-green-400 flex items-center gap-1">
                <span>V</span>
                Click &ldquo;Email Us&rdquo; &mdash; SmartMailto intercepts it
              </span>
              <SmartMailto
                href="mailto:contact@moonshot.ai"
                theme="light"
                className="inline-flex items-center bg-white text-black px-5 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors no-underline"
              >
                Email contact@moonshot.ai -- Try It
              </SmartMailto>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
